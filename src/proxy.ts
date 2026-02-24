import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest): NextResponse {
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Si no hay contraseña configurada, bloquear el acceso (más seguro)
    if (!adminPassword) {
        return new NextResponse("Admin password not configured.", { status: 500 });
    }

    const authHeader = req.headers.get("authorization");

    if (authHeader) {
        // Parsear HTTP Basic Auth: "Basic <base64(user:password)>"
        const base64 = authHeader.replace("Basic ", "");
        const decoded = Buffer.from(base64, "base64").toString("utf-8");
        const [, password] = decoded.split(":"); // Ignoramos el usuario
        if (password === adminPassword) {
            return NextResponse.next();
        }
    }

    // Solicitar autenticación al navegador
    return new NextResponse("Autenticación requerida.", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Panel de Administración ISpot"',
        },
    });
}

export const config = {
    matcher: ["/admin/:path*"],
};
