const products = [
  // CANON CAMERAS
  { id: 'c1', brand: 'Canon', category: 'Cameras', name: 'POWERSHOT G7 X MARK III', price: 1820 },
  { id: 'c2', brand: 'Canon', category: 'Cameras', name: 'POWERSHOT SX740', price: 1110 },
  { id: 'c3', brand: 'Canon', category: 'Cameras', name: 'POWERSHOT V1', price: 1210 },
  { id: 'c4', brand: 'Canon', category: 'Cameras', name: 'EOS 2000D KIT', price: 720 },
  { id: 'c5', brand: 'Canon', category: 'Cameras', name: 'EOS 4000D KIT', price: 800 },
  { id: 'c6', brand: 'Canon', category: 'Cameras', name: 'EOS 5D MARK IV BODY', price: 2170 },
  { id: 'c7', brand: 'Canon', category: 'Cameras', name: 'EOS 5D MARK IV KIT', price: 2920 },
  { id: 'c8', brand: 'Canon', category: 'Cameras', name: 'EOS R1 BODY', price: 6180 },
  { id: 'c9', brand: 'Canon', category: 'Cameras', name: 'EOS R3 BODY', price: 4780 },
  { id: 'c10', brand: 'Canon', category: 'Cameras', name: 'EOS R100 KIT (2 lentes)', price: 1100 },
  { id: 'c11', brand: 'Canon', category: 'Cameras', name: 'EOS R100 KIT', price: 880 },
  { id: 'c12', brand: 'Canon', category: 'Cameras', name: 'EOS R5 BODY', price: 3200 },
  { id: 'c13', brand: 'Canon', category: 'Cameras', name: 'EOS R5 KIT', price: 4050 },
  { id: 'c14', brand: 'Canon', category: 'Cameras', name: 'EOS R5 MARK II BODY', price: 4150 },
  { id: 'c15', brand: 'Canon', category: 'Cameras', name: 'EOS R5 MARK II KIT', price: 4880 },
  { id: 'c16', brand: 'Canon', category: 'Cameras', name: 'EOS R50 KIT', price: 1050 },
  { id: 'c17', brand: 'Canon', category: 'Cameras', name: 'EOS R50 V KIT', price: 1110 },
  { id: 'c18', brand: 'Canon', category: 'Cameras', name: 'EOS R5 C', price: 3240 },
  { id: 'c19', brand: 'Canon', category: 'Cameras', name: 'EOS R6 MARK II BODY', price: 2320 },
  { id: 'c20', brand: 'Canon', category: 'Cameras', name: 'EOS R6 MARK II KIT', price: 2720 },
  { id: 'c21', brand: 'Canon', category: 'Cameras', name: 'EOS R6 MARK III BODY', price: 3020 },
  { id: 'c22', brand: 'Canon', category: 'Cameras', name: 'EOS R6 MARK III KIT', price: 3450 },
  { id: 'c23', brand: 'Canon', category: 'Cameras', name: 'EOS R7 KIT', price: 1920 },
  { id: 'c24', brand: 'Canon', category: 'Cameras', name: 'EOS R8 KIT', price: 1800 },
  { id: 'c25', brand: 'Canon', category: 'Cameras', name: 'EOS RP KIT', price: 1520 },

  // SONY CAMERAS
  { id: 's1', brand: 'Sony', category: 'Cameras', name: 'ALFA 1 II', price: 6380 },
  { id: 's2', brand: 'Sony', category: 'Cameras', name: 'A6400 BODY', price: 960 },
  { id: 's3', brand: 'Sony', category: 'Cameras', name: 'A6400 KIT', price: 1160 },
  { id: 's4', brand: 'Sony', category: 'Cameras', name: 'A6700 BODY', price: 1620 },
  { id: 's5', brand: 'Sony', category: 'Cameras', name: 'A6700 KIT', price: 2020 },
  { id: 's6', brand: 'Sony', category: 'Cameras', name: 'A7 CR', price: 2570 },
  { id: 's7', brand: 'Sony', category: 'Cameras', name: 'A7 III BODY', price: 1620 },
  { id: 's8', brand: 'Sony', category: 'Cameras', name: 'A7 III KIT', price: 1820 },
  { id: 's9', brand: 'Sony', category: 'Cameras', name: 'A7 IV KIT', price: 2420 },
  { id: 's10', brand: 'Sony', category: 'Cameras', name: 'A7 V BODY', price: 2970 },
  { id: 's11', brand: 'Sony', category: 'Cameras', name: 'A7C BODY', price: 1720 },
  { id: 's12', brand: 'Sony', category: 'Cameras', name: 'A7C II BODY', price: 2120 },
  { id: 's13', brand: 'Sony', category: 'Cameras', name: 'A7C II KIT', price: 2370 },
  { id: 's14', brand: 'Sony', category: 'Cameras', name: 'A7R III', price: 1920 },
  { id: 's15', brand: 'Sony', category: 'Cameras', name: 'A7R IV', price: 2570 },
  { id: 's16', brand: 'Sony', category: 'Cameras', name: 'A7R V', price: 3240 },
  { id: 's17', brand: 'Sony', category: 'Cameras', name: 'A7S III', price: 2920 },
  { id: 's18', brand: 'Sony', category: 'Cameras', name: 'A9 III', price: 5420 },
  { id: 's19', brand: 'Sony', category: 'Cameras', name: 'RX100', price: 1720 },
  { id: 's20', brand: 'Sony', category: 'Cameras', name: 'FX2', price: 2870 },
  { id: 's21', brand: 'Sony', category: 'Cameras', name: 'FX3', price: 4050 },
  { id: 's22', brand: 'Sony', category: 'Cameras', name: 'FX30', price: 1870 },
  { id: 's23', brand: 'Sony', category: 'Cameras', name: 'FX6', price: 5720 },
  { id: 's24', brand: 'Sony', category: 'Cameras', name: 'ZV-E10 BODY', price: 940 },
  { id: 's25', brand: 'Sony', category: 'Cameras', name: 'ZV-E10 KIT', price: 1060 },
  { id: 's26', brand: 'Sony', category: 'Cameras', name: 'ZV-E10 KIT doble', price: 1370 },
  { id: 's27', brand: 'Sony', category: 'Cameras', name: 'ZV-E10 II BODY', price: 1260 },
  { id: 's28', brand: 'Sony', category: 'Cameras', name: 'ZV-E10 II KIT', price: 1520 },

  // NIKON CAMERAS
  { id: 'n1', brand: 'Nikon', category: 'Cameras', name: 'COOLPIX P950', price: 1150 },
  { id: 'n2', brand: 'Nikon', category: 'Cameras', name: 'COOLPIX P1100', price: 1510 },
  { id: 'n3', brand: 'Nikon', category: 'Cameras', name: 'D7500 BODY', price: 1160 },
  { id: 'n4', brand: 'Nikon', category: 'Cameras', name: 'D7500 KIT 35mm', price: 1330 },
  { id: 'n5', brand: 'Nikon', category: 'Cameras', name: 'D7500 KIT 50mm', price: 1330 },
  { id: 'n6', brand: 'Nikon', category: 'Cameras', name: 'D7500 KIT 18-140', price: 1310 },
  { id: 'n7', brand: 'Nikon', category: 'Cameras', name: 'D780 BODY', price: 1900 },
  { id: 'n8', brand: 'Nikon', category: 'Cameras', name: 'D780 KIT', price: 2420 },
  { id: 'n9', brand: 'Nikon', category: 'Cameras', name: 'D850 BODY', price: 2420 },
  { id: 'n10', brand: 'Nikon', category: 'Cameras', name: 'D850 KIT', price: 3000 },
  { id: 'n11', brand: 'Nikon', category: 'Cameras', name: 'Z30 KIT 12-28', price: 1170 },
  { id: 'n12', brand: 'Nikon', category: 'Cameras', name: 'Z30 KIT doble', price: 1470 },
  { id: 'n13', brand: 'Nikon', category: 'Cameras', name: 'Z30 KIT 18-140', price: 1310 },
  { id: 'n14', brand: 'Nikon', category: 'Cameras', name: 'Z5 II BODY', price: 1820 },
  { id: 'n15', brand: 'Nikon', category: 'Cameras', name: 'Z5 II KIT 24-200', price: 2620 },
  { id: 'n16', brand: 'Nikon', category: 'Cameras', name: 'Z5 II KIT 24-50', price: 2120 },
  { id: 'n17', brand: 'Nikon', category: 'Cameras', name: 'Z5 II KIT 24-70', price: 2810 },
  { id: 'n18', brand: 'Nikon', category: 'Cameras', name: 'Z50 KIT', price: 1200 },
  { id: 'n19', brand: 'Nikon', category: 'Cameras', name: 'Z50 II BODY', price: 1240 },
  { id: 'n20', brand: 'Nikon', category: 'Cameras', name: 'Z50 II KIT', price: 1360 },
  { id: 'n21', brand: 'Nikon', category: 'Cameras', name: 'Z6 II BODY', price: 2070 },
  { id: 'n22', brand: 'Nikon', category: 'Cameras', name: 'Z6 III BODY', price: 2420 },
  { id: 'n23', brand: 'Nikon', category: 'Cameras', name: 'Z6 III KIT', price: 3070 },
  { id: 'n24', brand: 'Nikon', category: 'Cameras', name: 'Z7 II BODY', price: 2320 },
  { id: 'n25', brand: 'Nikon', category: 'Cameras', name: 'Z8 BODY', price: 3760 },
  { id: 'n26', brand: 'Nikon', category: 'Cameras', name: 'ZFC KIT', price: 1320 },
  { id: 'n27', brand: 'Nikon', category: 'Cameras', name: 'ZR 6K', price: 2620 },

  // CANON LENSES (RF y EF)
  { id: 'cl1', brand: 'Canon', category: 'Lenses', name: 'EF 16-35 F/4L IS USM', price: 1150 },
  { id: 'cl2', brand: 'Canon', category: 'Lenses', name: 'EF 50MM F/1,4 USM', price: 480 },
  { id: 'cl3', brand: 'Canon', category: 'Lenses', name: 'EF S 10-18 F/4.5-5.6 IS STM', price: 490 },
  { id: 'cl4', brand: 'Canon', category: 'Lenses', name: 'EF S 24 F/2.8 STM', price: 310 },
  { id: 'cl5', brand: 'Canon', category: 'Lenses', name: 'RF 10-20 F/4 STM', price: 2950 },
  { id: 'cl6', brand: 'Canon', category: 'Lenses', name: 'RF 100 F2.8 L MACRO IS USM', price: 1750 },
  { id: 'cl7', brand: 'Canon', category: 'Lenses', name: 'RF 100-400 F/5.6-8 IS USM', price: 1100 },
  { id: 'cl8', brand: 'Canon', category: 'Lenses', name: 'RF 100-500 F/4.5-7.1 L IS USM', price: 3250 },
  { id: 'cl9', brand: 'Canon', category: 'Lenses', name: 'RF 14-35 F4L IS USM', price: 1750 },
  { id: 'cl10', brand: 'Canon', category: 'Lenses', name: 'RF 15-30 F4,5-6,3 IS', price: 780 },
  { id: 'cl11', brand: 'Canon', category: 'Lenses', name: 'RF 15-35 F/2.8 IS USM', price: 2650 },
  { id: 'cl12', brand: 'Canon', category: 'Lenses', name: 'RF 16-28 F/2.8 IS STM', price: 1480 },
  { id: 'cl13', brand: 'Canon', category: 'Lenses', name: 'RF 16 F/2,8 STM', price: 460 },
  { id: 'cl14', brand: 'Canon', category: 'Lenses', name: 'RF 20 f/1,4', price: 2300 },
  { id: 'cl15', brand: 'Canon', category: 'Lenses', name: 'RF 200-800MM F/6,3-9 IS USM', price: 2800 },
  { id: 'cl16', brand: 'Canon', category: 'Lenses', name: 'RF 24 F/1.4 VCM', price: 2200 },
  { id: 'cl17', brand: 'Canon', category: 'Lenses', name: 'RF 24 F1.8 MACRO IS STM', price: 790 },
  { id: 'cl18', brand: 'Canon', category: 'Lenses', name: 'RF 24-105 F/2.8 IS USM', price: 4100 },
  { id: 'cl19', brand: 'Canon', category: 'Lenses', name: 'RF 24-105 F/4 IS USM', price: 1950 },
  { id: 'cl20', brand: 'Canon', category: 'Lenses', name: 'RF 24-105 F/4-7,1 IS STM', price: 750 },
  { id: 'cl21', brand: 'Canon', category: 'Lenses', name: 'RF 24-240 F/4-6.3 IS USM', price: 1480 },
  { id: 'cl22', brand: 'Canon', category: 'Lenses', name: 'RF 28 F/2.8', price: 500 },
  { id: 'cl23', brand: 'Canon', category: 'Lenses', name: 'RF 28-70 F/2 L USM', price: 3350 },
  { id: 'cl24', brand: 'Canon', category: 'Lenses', name: 'RF 35 F/1,4 L VCM', price: 2250 },
  { id: 'cl25', brand: 'Canon', category: 'Lenses', name: 'RF 35 F/1.8 MACRO IS STM', price: 720 },
  { id: 'cl26', brand: 'Canon', category: 'Lenses', name: 'RF 50 F1,8 STM', price: 360 },
  { id: 'cl27', brand: 'Canon', category: 'Lenses', name: 'RF 600 F/11L IS STM', price: 1050 },
  { id: 'cl28', brand: 'Canon', category: 'Lenses', name: 'RF 70-200MM F/2.8 IS USM Z WHITE', price: 4350 },
  { id: 'cl29', brand: 'Canon', category: 'Lenses', name: 'RF 70-200 F/4L IS', price: 2050 },
  { id: 'cl30', brand: 'Canon', category: 'Lenses', name: 'RF 75-300 F/4-5.6', price: 450 },
  { id: 'cl31', brand: 'Canon', category: 'Lenses', name: 'RF 800MM F/11 IS STM', price: 1300 },
  { id: 'cl32', brand: 'Canon', category: 'Lenses', name: 'RF-S 10-18 F/4.5-6.3', price: 530 },
  { id: 'cl33', brand: 'Canon', category: 'Lenses', name: 'RF-S 3.9 F/3.5 DUAL FISHEYE STM', price: 1650 },
  { id: 'cl34', brand: 'Canon', category: 'Lenses', name: 'RF-S 18-150 F3.5-6.3 IS STM', price: 820 },
  { id: 'cl35', brand: 'Canon', category: 'Lenses', name: 'RF-S 7.8 F/4 STM DUAL', price: 820 },
  
  // SIGMA PARA CANON
  { id: 'cls1', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 10-18MM F/2,8 C', price: 1050 },
  { id: 'cls2', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 12 F/1.4 CONTEMPORARY RF', price: 1050 },
  { id: 'cls3', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 12-24 F/4 HSM ART', price: 1650 },
  { id: 'cls4', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 14-24MM F2,8 HSM', price: 1850 },
  { id: 'cls5', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 16-300 CONTEMPORARY', price: 1250 },
  { id: 'cls6', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 16MM F/1.4 DC DN EF-M', price: 620 },
  { id: 'cls7', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 18-35MM F1,8 ART HSM', price: 1050 },
  { id: 'cls8', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 30MM F/1.4 DC HSM ART EF', price: 520 },
  { id: 'cls9', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 35MM F/1.4 DG ART HSM', price: 1180 },
  { id: 'cls10', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 50-100MM F/1,8 ART DC HSM', price: 1300 },
  { id: 'cls11', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 50MM F/1,4 DG HSM ART', price: 1050 },
  { id: 'cls12', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 56MM F/1.4 DC DN CONTEMPORARY', price: 650 },
  { id: 'cls13', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 70MM F/2.8 DG MACRO ART', price: 750 },
  { id: 'cls14', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 85MM F/1,4 EX DG AF', price: 890 },
  { id: 'cls15', brand: 'Canon', category: 'Lenses / Sigma', name: 'SIGMA 85MM F/1,4 DG HSM ART EF', price: 1550 },

  // NIKON LENSES (Z y AF-S)
  { id: 'nl1', brand: 'Nikon', category: 'Lenses', name: 'AF DX ZOOM 12-24 F/4 IF', price: 1550 },
  { id: 'nl2', brand: 'Nikon', category: 'Lenses', name: 'AF-S 35 F/1.8 G', price: 390 },
  { id: 'nl3', brand: 'Nikon', category: 'Lenses', name: 'AF-S 50 F/1.8 G', price: 420 },
  { id: 'nl4', brand: 'Nikon', category: 'Lenses', name: 'Z 12-28 F/3.5-5.6 PZ VR', price: 600 },
  { id: 'nl5', brand: 'Nikon', category: 'Lenses', name: 'Z 135 F/1.8 S PLENA', price: 2900 },
  { id: 'nl6', brand: 'Nikon', category: 'Lenses', name: 'Z 14-24MM F2,8 S', price: 2650 },
  { id: 'nl7', brand: 'Nikon', category: 'Lenses', name: 'Z 14-30 F/4 S', price: 1650 },
  { id: 'nl8', brand: 'Nikon', category: 'Lenses', name: 'Z 16-50 DX VR', price: 680 },
  { id: 'nl9', brand: 'Nikon', category: 'Lenses', name: 'Z 17-28 F/2.8', price: 1650 },
  { id: 'nl10', brand: 'Nikon', category: 'Lenses', name: 'Z 18-140 DX VR', price: 750 },
  { id: 'nl11', brand: 'Nikon', category: 'Lenses', name: 'Z 24-200 F/4-6.3 VR', price: 1180 },
  { id: 'nl12', brand: 'Nikon', category: 'Lenses', name: 'Z 24-70 F2.8 II', price: 3250 },
  { id: 'nl13', brand: 'Nikon', category: 'Lenses', name: 'Z 24-70 F/4S', price: 1150 },
  { id: 'nl14', brand: 'Nikon', category: 'Lenses', name: 'Z 24 F 1.8', price: 1380 },
  { id: 'nl15', brand: 'Nikon', category: 'Lenses', name: 'Z 28-135 F/4 PZ', price: 3400 },
  { id: 'nl16', brand: 'Nikon', category: 'Lenses', name: 'Z 28-400 F/4-8 VR', price: 1680 },
  { id: 'nl17', brand: 'Nikon', category: 'Lenses', name: 'Z 28-75 f/2.8', price: 1180 },
  { id: 'nl18', brand: 'Nikon', category: 'Lenses', name: 'Z 28 F/2.8', price: 440 },
  { id: 'nl19', brand: 'Nikon', category: 'Lenses', name: 'Z 35 F 1,2 S', price: 3100 },
  { id: 'nl20', brand: 'Nikon', category: 'Lenses', name: 'Z 35MM F 1,4', price: 890 },
  { id: 'nl21', brand: 'Nikon', category: 'Lenses', name: 'Z 40MM F 2 SE', price: 490 },
  { id: 'nl22', brand: 'Nikon', category: 'Lenses', name: 'Z 50 F 1,2 S', price: 2450 },
  { id: 'nl23', brand: 'Nikon', category: 'Lenses', name: 'Z 50 F 1,4', price: 780 },
  { id: 'nl24', brand: 'Nikon', category: 'Lenses', name: 'Z 50 F 1,8 S', price: 840 },
  { id: 'nl25', brand: 'Nikon', category: 'Lenses', name: 'Z 70-200 F2,8 VR S', price: 3050 },
  { id: 'nl26', brand: 'Nikon', category: 'Lenses', name: 'Z 85 F/1.2', price: 3150 },
  { id: 'nl27', brand: 'Nikon', category: 'Lenses', name: 'Z 85 F/1.8 S', price: 1050 },
  { id: 'nl28', brand: 'Nikon', category: 'Lenses', name: 'Z DX 24 F/1.7', price: 490 },
  { id: 'nl29', brand: 'Nikon', category: 'Lenses', name: 'Z DX 50-250 F/4.5-6.3 VR', price: 650 },
  { id: 'nl30', brand: 'Nikon', category: 'Lenses', name: 'Z MC 50 F/2.8 MACRO', price: 920 },
  { id: 'nl31', brand: 'Nikon', category: 'Lenses', name: 'Z MC 105 F2.8 VR MACRO', price: 1450 },
  { id: 'nl32', brand: 'Nikon', category: 'Lenses', name: 'Z TELECONVERTER TC-1.4X', price: 780 },
  { id: 'nl33', brand: 'Nikon', category: 'Lenses', name: 'Z TELECONVERTER TC-2X', price: 820 },
  
  // SIGMA / TAMRON PARA NIKON
  { id: 'nt1', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 12-24 F4 DG ART', price: 1780 },
  { id: 'nt2', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 150-600 CONTEMPORARY', price: 1850 },
  { id: 'nt3', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 150-600 SPORTS', price: 2800 },
  { id: 'nt4', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 16 F/1.4 DC DN (Z)', price: 780 },
  { id: 'nt5', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 18-35 F/1.8 HSM', price: 1050 },
  { id: 'nt6', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 24-70 F/2,8 ART HSM', price: 1700 },
  { id: 'nt7', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 24MM F/1,4 ART', price: 1180 },
  { id: 'nt8', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 28 F/1.4 ART', price: 1020 },
  { id: 'nt9', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 30 F/1.4 DC DN (Z)', price: 560 },
  { id: 'nt10', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 35 F/1.4 ART', price: 1150 },
  { id: 'nt11', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 50 F/1,4 ART', price: 1350 },
  { id: 'nt12', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 56MM F/1.4 DC DN (Z)', price: 790 },
  { id: 'nt13', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 85MM F/1,4 EX DG', price: 920 },
  { id: 'nt14', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'SIGMA 85MM F/1,4 ART EF', price: 1600 },
  { id: 'nt15', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'TAMRON 16-30 F2.8 III G2', price: 1350 },
  { id: 'nt16', brand: 'Nikon', category: 'Lenses / Sigma-Tamron', name: 'TAMRON 70-300 F/4.5-6.3 (Z)', price: 920 },

  // SONY LENSES (E / FE)
  { id: 'sl1', brand: 'Sony', category: 'Lenses', name: 'DISTAGON T FE 35 F/1,4', price: 1380 },
  { id: 'sl2', brand: 'Sony', category: 'Lenses', name: 'E 55-210', price: 480 },
  { id: 'sl3', brand: 'Sony', category: 'Lenses', name: 'E 70-350', price: 1250 },
  { id: 'sl4', brand: 'Sony', category: 'Lenses', name: 'FE 100 F/2.8 GM OSS', price: 2100 },
  { id: 'sl5', brand: 'Sony', category: 'Lenses', name: 'FE 12-24 F/2.8 GM', price: 3100 },
  { id: 'sl6', brand: 'Sony', category: 'Lenses', name: 'FE 135 F1.8 GM', price: 2350 },
  { id: 'sl7', brand: 'Sony', category: 'Lenses', name: 'FE 14 F/1,8 GM', price: 1650 },
  { id: 'sl8', brand: 'Sony', category: 'Lenses', name: 'FE 16-25 F/2,8 G', price: 1550 },
  { id: 'sl9', brand: 'Sony', category: 'Lenses', name: 'FE 16-35 F/2,8 GM', price: 2100 },
  { id: 'sl10', brand: 'Sony', category: 'Lenses', name: 'FE 16-35 F/2,8 GM II', price: 2650 },
  { id: 'sl11', brand: 'Sony', category: 'Lenses', name: 'FE 16MM F/1,8 G', price: 1200 },
  { id: 'sl12', brand: 'Sony', category: 'Lenses', name: 'FE 20-70 F/4 GM', price: 1350 },
  { id: 'sl13', brand: 'Sony', category: 'Lenses', name: 'FE 200-600', price: 2700 },
  { id: 'sl14', brand: 'Sony', category: 'Lenses', name: 'FE 24-105 F/4 G', price: 1350 },
  { id: 'sl15', brand: 'Sony', category: 'Lenses', name: 'FE 24-50 F/2.8 G', price: 1700 },
  { id: 'sl16', brand: 'Sony', category: 'Lenses', name: 'FE 24-70 VARIO TESSAR', price: 1050 },
  { id: 'sl17', brand: 'Sony', category: 'Lenses', name: 'FE 24-70 F/2.8 GM', price: 2100 },
  { id: 'sl18', brand: 'Sony', category: 'Lenses', name: 'FE 24-70 F/2.8 GM II', price: 2650 },
  { id: 'sl19', brand: 'Sony', category: 'Lenses', name: 'FE 24MM F/1.4 GM', price: 1450 },
  { id: 'sl20', brand: 'Sony', category: 'Lenses', name: 'FE 28 F/2', price: 720 },
  { id: 'sl21', brand: 'Sony', category: 'Lenses', name: 'FE 28-70MM F/2 GM', price: 3650 },
  { id: 'sl22', brand: 'Sony', category: 'Lenses', name: 'FE 2X TELECONVERTER', price: 750 },
  { id: 'sl23', brand: 'Sony', category: 'Lenses', name: 'FE 35 F/1,4 GM', price: 1750 },
  { id: 'sl24', brand: 'Sony', category: 'Lenses', name: 'FE 400-800MM', price: 3600 },
  { id: 'sl25', brand: 'Sony', category: 'Lenses', name: 'FE 50 F/1.2 GM', price: 2150 },
  { id: 'sl26', brand: 'Sony', category: 'Lenses', name: 'FE 50-150 F/2 GM', price: 4700 },
  { id: 'sl27', brand: 'Sony', category: 'Lenses', name: 'FE 50 F/1.4 GM', price: 1550 },
  { id: 'sl28', brand: 'Sony', category: 'Lenses', name: 'FE 50MM F/1.8', price: 390 },
  { id: 'sl29', brand: 'Sony', category: 'Lenses', name: 'FE 55 F/1.8 ZA', price: 780 },
  { id: 'sl30', brand: 'Sony', category: 'Lenses', name: 'FE 70-200 F/4 MACRO', price: 2100 },
  { id: 'sl31', brand: 'Sony', category: 'Lenses', name: 'FE 85 F/1.4 GM II', price: 2250 },
  { id: 'sl32', brand: 'Sony', category: 'Lenses', name: 'FE 85 F/1,8', price: 720 },
  { id: 'sl33', brand: 'Sony', category: 'Lenses', name: 'FE 90 MACRO', price: 1100 },
  { id: 'sl34', brand: 'Sony', category: 'Lenses', name: 'FE PZ 16-35 F4', price: 1480 },
  { id: 'sl35', brand: 'Sony', category: 'Lenses', name: 'PLANAR T FE 50 F/1.4', price: 1650 },

  // DRONES DJI
  { id: 'dj1', brand: 'Drones', category: 'DJI', name: 'DJI AVATA PRO VIEW (SOLO DRONE)', price: 860 },
  { id: 'dj2', brand: 'Drones', category: 'DJI', name: 'DJI NEO 2 MOTION FLY MORE COMBO', price: 890 },
  { id: 'dj3', brand: 'Drones', category: 'DJI', name: 'DJI MINI 4 PRO FLY MORE COMBO RC 2', price: 1230 },
  { id: 'dj4', brand: 'Drones', category: 'DJI', name: 'DJI MINI 5 PRO (RC 2) + FLY MORE COMBO', price: 1450 },
  { id: 'dj5', brand: 'Drones', category: 'DJI', name: 'DJI MINI 5 PRO (RC 2) + FLY MORE COMBO PLUS', price: 1550 },
  { id: 'dj6', brand: 'Drones', category: 'DJI', name: 'DJI MINI 4 PRO FLY MORE COMB0 RC2 PLUS', price: 1430 },
  { id: 'dj7', brand: 'Drones', category: 'DJI', name: 'DJI AVATA 2 FLY MORE COMBO 3 BATERIAS', price: 1470 },
  { id: 'dj8', brand: 'Drones', category: 'DJI', name: 'DJI AIR 3S RC2 FLY MORE COMBO', price: 1870 },
  { id: 'dj9', brand: 'Drones', category: 'DJI', name: 'DJI MAVIC 4 PRO MORE FLY COMBO RC2', price: 3250 },

  // IPHONES
  { 
    id: 'ip17', brand: 'iPhone', category: 'iPhone 17', name: 'iPhone 17', price: 980,
    variants: [
      { storage: '256GB', price: 980, condition: 'Nuevo', colors: ['Lavender', 'Sage', 'Blue', 'White'] }
    ]
  },
  { 
    id: 'ip17p', brand: 'iPhone', category: 'iPhone 17', name: 'iPhone 17 Pro', price: 1370,
    variants: [
      { storage: '256GB', price: 1370, condition: 'Nuevo', colors: ['Silver ⚪️'] },
      { storage: '512GB', price: 1570, condition: 'Nuevo', colors: ['Silver ⚪️', 'Blue 🔵'] }
    ]
  },
  { 
    id: 'ip17pm', brand: 'iPhone', category: 'iPhone 17', name: 'iPhone 17 Pro Max', price: 1470,
    variants: [
      { storage: '256GB (Tránsito)', price: 1470, condition: 'Nuevo', colors: ['Consultar'] },
      { storage: '256GB', price: 1510, condition: 'Nuevo', colors: ['Silver ⚪️'] },
      { storage: '512GB', price: 1720, condition: 'Nuevo', colors: ['Silver ⚪️'] },
      { storage: '1TB', price: 1970, condition: 'Nuevo', colors: ['Blue 🔵', 'Silver ⚪️'] }
    ]
  },
  { 
    id: 'ip16e', brand: 'iPhone', category: 'iPhone 16', name: 'iPhone 16e', price: 670,
    variants: [
      { storage: '128GB', price: 670, condition: 'Nuevo', colors: ['Black'] }
    ]
  },
  { 
    id: 'ip16', brand: 'iPhone', category: 'iPhone 16', name: 'iPhone 16', price: 820,
    variants: [
      { storage: '128GB', price: 820, condition: 'Nuevo', colors: ['Pink'] },
      { storage: '256GB', price: 910, condition: 'Nuevo', colors: ['Ultramarine'] }
    ]
  },
  { 
    id: 'ip16pl', brand: 'iPhone', category: 'iPhone 16', name: 'iPhone 16 Plus', price: 910,
    variants: [
      { storage: '128GB', price: 910, condition: 'Nuevo', colors: ['Ultramarino', 'Black'] }
    ]
  },
  { 
    id: 'ip16p', brand: 'iPhone', category: 'iPhone 16', name: 'iPhone 16 Pro', price: 1070,
    variants: [
      { storage: '128GB', price: 1070, condition: 'Nuevo', colors: ['Natural'] }
    ]
  },
  { 
    id: 'ip15', brand: 'iPhone', category: 'iPhone 15', name: 'iPhone 15', price: 720,
    variants: [
      { storage: '128GB', price: 720, condition: 'Nuevo', colors: ['Black', 'Pink', 'Blue'] },
      { storage: '256GB', price: 820, condition: 'Nuevo', colors: ['Pink', 'Blue'] }
    ]
  },
  { 
    id: 'ip15pc', brand: 'iPhone', category: 'iPhone 15', name: 'iPhone 15 Pro (CPO)', price: 890,
    variants: [
      { storage: '128GB', price: 890, condition: 'CPO (12m gtía)', colors: ['Blue'] },
      { storage: '256GB', price: 970, condition: 'CPO (12m gtía)', colors: ['Blue'] }
    ]
  },
  { 
    id: 'ip14', brand: 'iPhone', category: 'iPhone Anteriores', name: 'iPhone 14', price: 630,
    variants: [
      { storage: '128GB', price: 630, condition: 'Nuevo', colors: ['Black'] }
    ]
  },
  { 
    id: 'ip14pmc', brand: 'iPhone', category: 'iPhone Anteriores', name: 'iPhone 14 Pro Max (CPO)', price: 890,
    variants: [
      { storage: '128GB', price: 890, condition: 'CPO (12m gtía)', colors: ['Gold', 'Silver'] }
    ]
  },
  { 
    id: 'ip13', brand: 'iPhone', category: 'iPhone Anteriores', name: 'iPhone 13', price: 605,
    variants: [
      { storage: '128GB', price: 605, condition: 'Nuevo', colors: ['Black'] }
    ]
  },
  { 
    id: 'ip13c', brand: 'iPhone', category: 'iPhone Anteriores', name: 'iPhone 13 (CPO)', price: 590,
    variants: [
      { storage: '128GB', price: 590, condition: 'CPO (12m gtía)', colors: ['Black'] },
      { storage: '256GB', price: 660, condition: 'CPO (12m gtía)', colors: ['Black', 'Pink', 'Starlight'] }
    ]
  },
  { 
    id: 'ip13pc', brand: 'iPhone', category: 'iPhone Anteriores', name: 'iPhone 13 Pro (CPO)', price: 690,
    variants: [
      { storage: '128GB', price: 690, condition: 'CPO (12m gtía)', colors: ['Grafito'] }
    ]
  },
  { 
    id: 'ip13pmc', brand: 'iPhone', category: 'iPhone Anteriores', name: 'iPhone 13 Pro Max (CPO)', price: 780,
    variants: [
      { storage: '128GB', price: 780, condition: 'CPO (12m gtía)', colors: ['Grafito', 'Green'] }
    ]
  },
  { 
    id: 'ip11pc', brand: 'iPhone', category: 'iPhone Anteriores', name: 'iPhone 11 Pro (CPO)', price: 450,
    variants: [
      { storage: '64GB', price: 450, condition: 'CPO (Caja+accs)', colors: ['Silver'] }
    ]
  },

  // MACBOOKS - AIR
  {
    id: 'mba13_m1', brand: 'MacBooks', category: 'MACBOOK AIR', name: 'MacBook Air 13" M1', price: 720,
    variants: [
      { storage: '8c/8GB/256GB - REFU GEN BOX', price: 720, condition: 'REFU GEN BOX', colors: ['Silver'] },
      { storage: '8c/8GB/256GB - Inglés', price: 880, condition: 'Nuevo', colors: ['Space Gray', 'Silver'] }
    ]
  },
  {
    id: 'mba13_m2', brand: 'MacBooks', category: 'MACBOOK AIR', name: 'MacBook Air 13" M2', price: 990,
    variants: [
      { storage: '8c/16GB/256GB - Español', price: 990, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },
  {
    id: 'mba13_neo', brand: 'MacBooks', category: 'MACBOOK AIR', name: 'MacBook Air 13" Neo A18 Pro', price: 940,
    variants: [
      { storage: '6c/8GB/256GB - Inglés', price: 940, condition: 'Nuevo', colors: ['Silver / Indigo'] },
      { storage: '6c/8GB/256GB Blush - Inglés', price: 960, condition: 'Nuevo', colors: ['Blush'] },
      { storage: '6c/8GB/512GB - Inglés', price: 1070, condition: 'Nuevo', colors: ['Indigo'] },
      { storage: '6c/8GB/512GB S/B/C - Inglés', price: 1070, condition: 'Nuevo', colors: ['Silver / Blush / Citrus'] }
    ]
  },
  {
    id: 'mba13_m4', brand: 'MacBooks', category: 'MACBOOK AIR', name: 'MacBook Air 13" M4', price: 1290,
    variants: [
      { storage: '8c/16GB/256GB (Inglés)', price: 1290, condition: 'Nuevo', colors: ['Sky Blue / Midnight / Silver'] },
      { storage: '10c/16GB/512GB (Inglés)', price: 1520, condition: 'Nuevo', colors: ['Sky Blue / Silver'] },
      { storage: '10c/16GB/512GB Mid. (Inglés)', price: 1560, condition: 'Nuevo', colors: ['Midnight'] },
      { storage: '10c/24GB/512GB (Inglés)', price: 1790, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },
  {
    id: 'mba13_m5', brand: 'MacBooks', category: 'MACBOOK AIR', name: 'MacBook Air 13" M5', price: 1590,
    variants: [
      { storage: '10c/16GB/512GB', price: 1590, condition: 'Nuevo', colors: ['Silver / Sky Blue / Midnight'] },
      { storage: '10c/16GB/1TB', price: 1800, condition: 'Nuevo', colors: ['Silver / Midnight / Starlight'] }
    ]
  },
  {
    id: 'mba15_m3', brand: 'MacBooks', category: 'MACBOOK AIR', name: 'MacBook Air 15" M3', price: 1370,
    variants: [
      { storage: '8c CPU 10c GPU/8GB/512GB', price: 1370, condition: 'Nuevo - Español', colors: ['Midnight'] }
    ]
  },
  {
    id: 'mba15_m4', brand: 'MacBooks', category: 'MACBOOK AIR', name: 'MacBook Air 15" M4', price: 1480,
    variants: [
      { storage: '10c/16GB/256GB (Inglés)', price: 1480, condition: 'Nuevo', colors: ['Midnight'] },
      { storage: '10c/16GB/512GB S.Blue (Inglés)', price: 1770, condition: 'Nuevo', colors: ['Sky Blue'] },
      { storage: '10c/16GB/512GB S/M (Inglés)', price: 1750, condition: 'Nuevo', colors: ['Starlight / Midnight'] }
    ]
  },
  
  // MACBOOKS - PRO
  {
    id: 'mbp14_m4p', brand: 'MacBooks', category: 'MACBOOK PRO', name: 'MacBook Pro 14" M4 Pro', price: 2490,
    variants: [
      { storage: '12c CPU 16c GPU/24GB/512GB', price: 2490, condition: 'Nuevo', colors: ['Space Black'] }
    ]
  },
  {
    id: 'mbp14_m5', brand: 'MacBooks', category: 'MACBOOK PRO', name: 'MacBook Pro 14" M5', price: 2000,
    variants: [
      { storage: '10c/16GB/512GB', price: 2000, condition: 'Nuevo', colors: ['Space Black / Silver'] },
      { storage: '10c/16GB/1TB', price: 2240, condition: 'Nuevo', colors: ['Space Black'] },
      { storage: '10c/24GB/1TB', price: 2480, condition: 'Nuevo', colors: ['Space Black'] }
    ]
  },
  {
    id: 'mbp14_m5p', brand: 'MacBooks', category: 'MACBOOK PRO', name: 'MacBook Pro 14" M5 Pro', price: 3150,
    variants: [
      { storage: '15c/24GB/1TB', price: 3150, condition: 'Nuevo', colors: ['Space Black'] }
    ]
  },
  {
    id: 'mbp14_m5m', brand: 'MacBooks', category: 'MACBOOK PRO', name: 'MacBook Pro 14" M5 Max', price: 4850,
    variants: [
      { storage: '18c/36GB/2TB', price: 4850, condition: 'Nuevo', colors: ['Space Black'] }
    ]
  },
  {
    id: 'mbp16_m3p', brand: 'MacBooks', category: 'MACBOOK PRO', name: 'MacBook Pro 16" M3 Pro', price: 2850,
    variants: [
      { storage: '12c CPU 18c GPU/36GB/512GB', price: 2850, condition: 'Nuevo', colors: ['Space Black'] }
    ]
  },
  {
    id: 'mbp16_m4p', brand: 'MacBooks', category: 'MACBOOK PRO', name: 'MacBook Pro 16" M4 Pro', price: 3250,
    variants: [
      { storage: '14c CPU 20c GPU/24GB/512GB', price: 3250, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },
  {
    id: 'mbp16_m5p', brand: 'MacBooks', category: 'MACBOOK PRO', name: 'MacBook Pro 16" M5 Pro', price: 3490,
    variants: [
      { storage: '18c/24GB/1TB OPEN BOX', price: 3490, condition: 'OPEN BOX', colors: ['Space Black'] },
      { storage: '18c/48GB/1TB', price: 4300, condition: 'Nuevo', colors: ['Space Black / Silver'] }
    ]
  },

  // MAC MINI
  {
    id: 'mm_m4', brand: 'MacBooks', category: 'MAC MINI', name: 'Mac Mini M4', price: 810,
    variants: [
      { storage: '10c/16GB/256GB', price: 810, condition: 'Nuevo', colors: ['Silver'] },
      { storage: '10c/24GB/512GB', price: 1590, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },
  {
    id: 'mm_m4p', brand: 'MacBooks', category: 'MAC MINI', name: 'Mac Mini M4 Pro', price: 1940,
    variants: [
      { storage: '12c CPU 16c GPU/24GB/512GB', price: 1940, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },

  // IMAC
  {
    id: 'imac24_m4_8c', brand: 'MacBooks', category: 'IMAC', name: 'iMac 24" M4 (8c CPU)', price: 2100,
    variants: [
      { storage: '8c/16GB/256GB', price: 2100, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },
  {
    id: 'imac24_m4_10c', brand: 'MacBooks', category: 'IMAC', name: 'iMac 24" M4 (10c CPU)', price: 2290,
    variants: [
      { storage: '10c/16GB/256GB', price: 2290, condition: 'Nuevo', colors: ['Pink'] },
      { storage: '10c/16GB/512GB', price: 2530, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },

  // IPADS
  {
    id: 'ipad_mini_7_a17', brand: 'MacBooks', category: 'IPAD', name: 'iPad Mini 8.3" (7th Gen) A17 Pro', price: 640,
    variants: [
      { storage: '128GB - WiFi', price: 640, condition: 'Nuevo', colors: ['Space Gray'] }
    ]
  },
  {
    id: 'ipad_10_9', brand: 'MacBooks', category: 'IPAD', name: 'iPad 10.9" (10th Gen)', price: 410,
    variants: [
      { storage: '64GB - WiFi', price: 410, condition: 'Nuevo', colors: ['Silver'] }
    ]
  },
  {
    id: 'ipad_11_a16', brand: 'MacBooks', category: 'IPAD', name: 'iPad 11" A16 (11th Gen)', price: 480,
    variants: [
      { storage: '128GB - WiFi', price: 480, condition: 'Nuevo', colors: ['Silver', 'Blue', 'Pink', 'Yellow'] },
      { storage: '256GB - WiFi', price: 620, condition: 'Nuevo', colors: ['Silver', 'Blue', 'Pink'] }
    ]
  },
  {
    id: 'ipad_air_11_m3', brand: 'MacBooks', category: 'IPAD', name: 'iPad Air 11" M3', price: 740,
    variants: [
      { storage: '128GB - WiFi', price: 740, condition: 'Nuevo', colors: ['Space Gray', 'Blue'] }
    ]
  },
  {
    id: 'ipad_air_11_m4', brand: 'MacBooks', category: 'IPAD', name: 'iPad Air 11" M4 (NEW)', price: 820,
    variants: [
      { storage: '128GB - WiFi', price: 820, condition: 'Nuevo', colors: ['Space Gray', 'Blue', 'Starlight'] },
      { storage: '256GB - WiFi', price: 940, condition: 'Nuevo', colors: ['Blue', 'Starlight'] }
    ]
  },
  {
    id: 'ipad_air_13_m3', brand: 'MacBooks', category: 'IPAD', name: 'iPad Air 13" M3', price: 1030,
    variants: [
      { storage: '128GB - WiFi', price: 1030, condition: 'Nuevo', colors: ['Space Gray', 'Blue', 'Starlight', 'Purple'] }
    ]
  },
  {
    id: 'ipad_air_13_m4', brand: 'MacBooks', category: 'IPAD', name: 'iPad Air 13" M4 (NEW)', price: 1180,
    variants: [
      { storage: '256GB - WiFi', price: 1180, condition: 'Nuevo', colors: ['Space Gray', 'Blue'] }
    ]
  },
  {
    id: 'ipad_pro_11_m5', brand: 'MacBooks', category: 'IPAD', name: 'iPad Pro 11" M5', price: 1200,
    variants: [
      { storage: '256GB - WiFi 7', price: 1200, condition: 'Nuevo', colors: ['Space Black', 'Silver'] },
      { storage: '512GB - WiFi 7', price: 1510, condition: 'Nuevo', colors: ['Space Black', 'Silver'] }
    ]
  },
  {
    id: 'ipad_pro_13_m4', brand: 'MacBooks', category: 'IPAD', name: 'iPad Pro 13" M4', price: 1660,
    variants: [
      { storage: '512GB - WiFi + Cel', price: 1660, condition: 'Nuevo', colors: ['Space Black'] }
    ]
  },
  {
    id: 'ipad_pro_13_m5', brand: 'MacBooks', category: 'IPAD', name: 'iPad Pro 13" M5', price: 1550,
    variants: [
      { storage: '256GB - WiFi 7', price: 1550, condition: 'Nuevo', colors: ['Space Black'] },
      { storage: '256GB - WiFi 7 (Silver)', price: 1560, condition: 'Nuevo', colors: ['Silver'] },
      { storage: '512GB - WiFi 7', price: 1880, condition: 'Nuevo', colors: ['Space Black'] }
    ]
  },
  {
    id: 'mk_ipad_10g', brand: 'MacBooks', category: 'IPAD', name: 'Magic Keyboard para iPad A16 (10th Gen)', price: 400,
    variants: [
      { storage: 'Accesorio', price: 400, condition: 'Nuevo', colors: ['White'] }
    ]
  }
];
