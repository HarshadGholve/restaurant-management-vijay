export interface MenuItem {
  id: string;
  nameMarathi: string;
  nameEnglish: string;
  price: number | string; // string for items like "300/400"
  category: string;
  isVeg: boolean;
}

export interface MenuCategory {
  id: string;
  nameMarathi: string;
  nameEnglish: string;
  type: 'veg' | 'nonveg' | 'both';
}

export const categories: MenuCategory[] = [
  { id: 'maincourse', nameMarathi: 'मेन कोर्स', nameEnglish: 'Main Course', type: 'veg' },
  { id: 'snacks', nameMarathi: 'स्नॅक्स', nameEnglish: 'Snacks', type: 'veg' },
  { id: 'rice', nameMarathi: 'राईस', nameEnglish: 'Rice', type: 'veg' },
  { id: 'roti', nameMarathi: 'रोटी', nameEnglish: 'Roti/Bread', type: 'veg' },
  { id: 'colddrinks', nameMarathi: 'कोल्ड्रिंक्स', nameEnglish: 'Cold Drinks', type: 'veg' },
  { id: 'extras', nameMarathi: 'एक्स्ट्रा', nameEnglish: 'Extras', type: 'veg' },
  { id: 'mutton', nameMarathi: 'मटन', nameEnglish: 'Mutton', type: 'nonveg' },
  { id: 'chicken', nameMarathi: 'चिकन आर.आर.', nameEnglish: 'Chicken RR', type: 'nonveg' },
  { id: 'egg', nameMarathi: 'अंडे', nameEnglish: 'Eggs', type: 'nonveg' },
  { id: 'fish', nameMarathi: 'मच्छ', nameEnglish: 'Fish', type: 'nonveg' },
];

export const menuItems: MenuItem[] = [
  // VEG
  { id: 'v1', nameMarathi: 'पनिर मसाला', nameEnglish: 'Paneer Masala', price: 170, category: 'maincourse', isVeg: true },
  { id: 'v2', nameMarathi: 'पनिर बटर मसाला', nameEnglish: 'Paneer Butter Masala', price: 180, category: 'maincourse', isVeg: true },
  { id: 'v3', nameMarathi: 'पनिर मटर', nameEnglish: 'Paneer Matar', price: 170, category: 'maincourse', isVeg: true },
  { id: 'v4', nameMarathi: 'पनिर पटियाला', nameEnglish: 'Paneer Patiala', price: 220, category: 'maincourse', isVeg: true },
  { id: 'v5', nameMarathi: 'पनिर कोमा', nameEnglish: 'Paneer Koma', price: 220, category: 'maincourse', isVeg: true },
  { id: 'v6', nameMarathi: 'पनिर कढाई', nameEnglish: 'Paneer Kadhai', price: 220, category: 'maincourse', isVeg: true },
  { id: 'v7', nameMarathi: 'काजु पनिर', nameEnglish: 'Kaju Paneer', price: 190, category: 'maincourse', isVeg: true },
  { id: 'v8', nameMarathi: 'काजुकरी', nameEnglish: 'Kajukari', price: 170, category: 'maincourse', isVeg: true },
  { id: 'v9', nameMarathi: 'व्हेज कोल्हापुरी', nameEnglish: 'Veg Kolhapuri', price: 180, category: 'maincourse', isVeg: true },
  { id: 'v10', nameMarathi: 'मिक्स व्हेज', nameEnglish: 'Mix Veg', price: 170, category: 'maincourse', isVeg: true },
  { id: 'v11', nameMarathi: 'पनीर टिक्का मसाला', nameEnglish: 'Paneer Tikka Masala', price: 190, category: 'maincourse', isVeg: true },
  { id: 'v12', nameMarathi: 'व्हेज मराठा', nameEnglish: 'Veg Maratha', price: 200, category: 'maincourse', isVeg: true },
  { id: 'v13', nameMarathi: 'व्हेज भुना', nameEnglish: 'Veg Bhuna', price: 200, category: 'maincourse', isVeg: true },
  { id: 'v14', nameMarathi: 'शाही पनीर', nameEnglish: 'Shahi Paneer', price: 200, category: 'maincourse', isVeg: true },
  { id: 'v15', nameMarathi: 'पनीर पसंदा', nameEnglish: 'Paneer Pasanda', price: 200, category: 'maincourse', isVeg: true },
  { id: 'v16', nameMarathi: 'पालक पनिर', nameEnglish: 'Palak Paneer', price: 180, category: 'maincourse', isVeg: true },
  { id: 'v17', nameMarathi: 'व्हेज हांडी हाफ/फुल', nameEnglish: 'Veg Handi Half/Full', price: '300/400', category: 'maincourse', isVeg: true },
  { id: 'v18', nameMarathi: 'पनीर हांडी हाफ/फुल', nameEnglish: 'Paneer Handi Half/Full', price: '400/700', category: 'maincourse', isVeg: true },
  { id: 'v19', nameMarathi: 'काजु हांडी हाफ/फुल', nameEnglish: 'Kaju Handi Half/Full', price: '350/700', category: 'maincourse', isVeg: true },
  { id: 'v20', nameMarathi: 'शेवगा हांडी हाफ/फुल', nameEnglish: 'Shevga Handi Half/Full', price: '250/400', category: 'maincourse', isVeg: true },
  { id: 'v21', nameMarathi: 'शेवभाजी हांडी हाफ/फुल', nameEnglish: 'Shevbhaji Handi Half/Full', price: '250/400', category: 'maincourse', isVeg: true },
  { id: 'v22', nameMarathi: 'उंबर हांडी हाफ/फुल', nameEnglish: 'Umbar Handi Half/Full', price: '250/400', category: 'maincourse', isVeg: true },
  { id: 'v23', nameMarathi: 'शिंगोरी आमटी हाफ/फुल', nameEnglish: 'Shingori Amti Half/Full', price: '200/400', category: 'maincourse', isVeg: true },
  { id: 'v24', nameMarathi: 'शेवभाजी', nameEnglish: 'Shevbhaji', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v25', nameMarathi: 'सोयाबीन मसाला', nameEnglish: 'Soyabean Masala', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v26', nameMarathi: 'मटकी मसाला', nameEnglish: 'Matki Masala', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v27', nameMarathi: 'चना मसाला', nameEnglish: 'Chana Masala', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v28', nameMarathi: 'ग्रिनपिस मसाला', nameEnglish: 'Green Peas Masala', price: 180, category: 'maincourse', isVeg: true },
  { id: 'v29', nameMarathi: 'बैंगन मसाला', nameEnglish: 'Brinjal Masala', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v30', nameMarathi: 'दाळ तडका', nameEnglish: 'Dal Tadka', price: 180, category: 'maincourse', isVeg: true },
  { id: 'v31', nameMarathi: 'दाळफ्राय', nameEnglish: 'Dal Fry', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v32', nameMarathi: 'मेथी मसाला', nameEnglish: 'Methi Masala', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v33', nameMarathi: 'तवा बेसन तडका', nameEnglish: 'Tawa Besan Tadka', price: 180, category: 'maincourse', isVeg: true },
  { id: 'v34', nameMarathi: 'शेंगदाणा पिठल', nameEnglish: 'Shengdana Pithal', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v35', nameMarathi: 'शेवगा मसाला', nameEnglish: 'Shevga Masala', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v36', nameMarathi: 'पालक प्लेन', nameEnglish: 'Palak Plain', price: 120, category: 'maincourse', isVeg: true },
  { id: 'v37', nameMarathi: 'शेंगदाणा ठेचा', nameEnglish: 'Shengdana Thecha', price: 100, category: 'maincourse', isVeg: true },
  { id: 'v38', nameMarathi: 'शेंगदाणा चटणी', nameEnglish: 'Shengdana Chutney', price: 100, category: 'maincourse', isVeg: true },

  // SNACKS
  { id: 's1', nameMarathi: 'शेवगा फ्राय', nameEnglish: 'Shevga Fry', price: 120, category: 'snacks', isVeg: true },
  { id: 's2', nameMarathi: 'सोयाबिन फ्राय', nameEnglish: 'Soyabean Fry', price: 120, category: 'snacks', isVeg: true },
  { id: 's3', nameMarathi: 'मटकी फ्राय', nameEnglish: 'Matki Fry', price: 120, category: 'snacks', isVeg: true },
  { id: 's4', nameMarathi: 'सोयाबिन रोस्ट', nameEnglish: 'Soyabean Roast', price: 130, category: 'snacks', isVeg: true },
  { id: 's5', nameMarathi: 'चना रोस्ट', nameEnglish: 'Chana Roast', price: 120, category: 'snacks', isVeg: true },
  { id: 's6', nameMarathi: 'पनिर चिल्ली', nameEnglish: 'Paneer Chilli', price: 200, category: 'snacks', isVeg: true },
  { id: 's7', nameMarathi: 'पनिर क्रिस्पी', nameEnglish: 'Paneer Crispy', price: 220, category: 'snacks', isVeg: true },
  { id: 's8', nameMarathi: 'सोयाबिन चिल्ली', nameEnglish: 'Soyabean Chilli', price: 150, category: 'snacks', isVeg: true },
  { id: 's9', nameMarathi: 'कांदा पकोडा', nameEnglish: 'Kanda Pakoda', price: 100, category: 'snacks', isVeg: true },
  { id: 's10', nameMarathi: 'लसुन फ्राय', nameEnglish: 'Lasun Fry', price: 120, category: 'snacks', isVeg: true },
  { id: 's11', nameMarathi: 'मटकी नमकीन फ्राय', nameEnglish: 'Matki Namkeen Fry', price: 120, category: 'snacks', isVeg: true },
  { id: 's12', nameMarathi: 'पनिर फ्राय', nameEnglish: 'Paneer Fry', price: 230, category: 'snacks', isVeg: true },
  { id: 's13', nameMarathi: 'ग्रिनपिस फ्राय', nameEnglish: 'Green Peas Fry', price: 120, category: 'snacks', isVeg: true },
  { id: 's14', nameMarathi: 'ग्रिनपिस रोस्ट', nameEnglish: 'Green Peas Roast', price: 120, category: 'snacks', isVeg: true },
  { id: 's15', nameMarathi: 'चना फ्राय', nameEnglish: 'Chana Fry', price: 100, category: 'snacks', isVeg: true },
  { id: 's16', nameMarathi: 'मसाला पापड', nameEnglish: 'Masala Papad', price: 80, category: 'snacks', isVeg: true },
  { id: 's17', nameMarathi: 'नागली पापड', nameEnglish: 'Nagli Papad', price: 30, category: 'snacks', isVeg: true },
  { id: 's18', nameMarathi: 'रोस्ट पापड', nameEnglish: 'Roast Papad', price: 20, category: 'snacks', isVeg: true },
  { id: 's19', nameMarathi: 'फ्राय पापड', nameEnglish: 'Fry Papad', price: 30, category: 'snacks', isVeg: true },
  { id: 's20', nameMarathi: 'पनिर भुर्जी', nameEnglish: 'Paneer Bhurji', price: 200, category: 'snacks', isVeg: true },
  { id: 's21', nameMarathi: 'व्हेज मंचुरियन', nameEnglish: 'Veg Manchurian', price: 180, category: 'snacks', isVeg: true },
  { id: 's22', nameMarathi: 'व्हेज मनचाव सुप हाफ/फुल', nameEnglish: 'Veg Manchow Soup Half/Full', price: '40/80', category: 'snacks', isVeg: true },
  { id: 's23', nameMarathi: 'पनिर ६५', nameEnglish: 'Paneer 65', price: 220, category: 'snacks', isVeg: true },

  // RICE
  { id: 'r1', nameMarathi: 'जिरा राईस हाफ/फुल', nameEnglish: 'Jeera Rice Half/Full', price: '60/100', category: 'rice', isVeg: true },
  { id: 'r2', nameMarathi: 'मसाला राईस', nameEnglish: 'Masala Rice', price: 150, category: 'rice', isVeg: true },
  { id: 'r3', nameMarathi: 'व्हेज पुलाव', nameEnglish: 'Veg Pulav', price: 170, category: 'rice', isVeg: true },
  { id: 'r4', nameMarathi: 'दाळ खिचडी', nameEnglish: 'Dal Khichdi', price: 150, category: 'rice', isVeg: true },
  { id: 'r5', nameMarathi: 'व्हेज बिर्याणी', nameEnglish: 'Veg Biryani', price: 170, category: 'rice', isVeg: true },

  // MUTTON
  { id: 'm1', nameMarathi: 'मटन फ्राय', nameEnglish: 'Mutton Fry', price: 200, category: 'mutton', isVeg: false },
  { id: 'm2', nameMarathi: 'मटन उक्कड', nameEnglish: 'Mutton Ukkad', price: 200, category: 'mutton', isVeg: false },
  { id: 'm3', nameMarathi: 'मटन थाळी', nameEnglish: 'Mutton Thali', price: 300, category: 'mutton', isVeg: false },
  { id: 'm4', nameMarathi: 'मटन मसाला', nameEnglish: 'Mutton Masala', price: 200, category: 'mutton', isVeg: false },
  { id: 'm5', nameMarathi: 'मटन हांडी हाफ/फुल', nameEnglish: 'Mutton Handi Half/Full', price: '800/600', category: 'mutton', isVeg: false },
  { id: 'm6', nameMarathi: 'मटन बिर्याणी', nameEnglish: 'Mutton Biryani', price: 220, category: 'mutton', isVeg: false },

  // CHICKEN
  { id: 'c1', nameMarathi: 'चिकन फ्राय', nameEnglish: 'Chicken Fry', price: 140, category: 'chicken', isVeg: false },
  { id: 'c2', nameMarathi: 'चिकन उक्कड', nameEnglish: 'Chicken Ukkad', price: 140, category: 'chicken', isVeg: false },
  { id: 'c3', nameMarathi: 'चिकन मसाला', nameEnglish: 'Chicken Masala', price: 160, category: 'chicken', isVeg: false },
  { id: 'c4', nameMarathi: 'चिकन हांडी हाफ/फुल', nameEnglish: 'Chicken Handi Half/Full', price: '340/700', category: 'chicken', isVeg: false },
  { id: 'c5', nameMarathi: 'चिकन थाळी', nameEnglish: 'Chicken Thali', price: 250, category: 'chicken', isVeg: false },
  { id: 'c6', nameMarathi: 'चिकन रोस्ट', nameEnglish: 'Chicken Roast', price: 160, category: 'chicken', isVeg: false },
  { id: 'c7', nameMarathi: 'चिकन चिल्ली', nameEnglish: 'Chicken Chilli', price: 170, category: 'chicken', isVeg: false },
  { id: 'c8', nameMarathi: 'चिकन बिर्याणी', nameEnglish: 'Chicken Biryani', price: 200, category: 'chicken', isVeg: false },
  { id: 'c9', nameMarathi: 'बॉयलर चिकन फ्राय', nameEnglish: 'Boiler Chicken Fry', price: 130, category: 'chicken', isVeg: false },
  { id: 'c10', nameMarathi: 'बॉयलर चिकन मसाला', nameEnglish: 'Boiler Chicken Masala', price: 130, category: 'chicken', isVeg: false },
  { id: 'c11', nameMarathi: 'बॉयलर चिकन थाळी', nameEnglish: 'Boiler Chicken Thali', price: 220, category: 'chicken', isVeg: false },

  // EGG
  { id: 'e1', nameMarathi: 'आम्लेट', nameEnglish: 'Omlette', price: 60, category: 'egg', isVeg: false },
  { id: 'e2', nameMarathi: 'अंडाभुर्जी', nameEnglish: 'Anda Bhurji', price: 40, category: 'egg', isVeg: false },
  { id: 'e3', nameMarathi: 'बॉईल फ्राय', nameEnglish: 'Boil Fry', price: 40, category: 'egg', isVeg: false },
  { id: 'e4', nameMarathi: 'बॉईल रोस्ट', nameEnglish: 'Boil Roast', price: 40, category: 'egg', isVeg: false },
  { id: 'e5', nameMarathi: 'बॉईल प्लेट', nameEnglish: 'Boil Plate', price: 80, category: 'egg', isVeg: false },
  { id: 'e6', nameMarathi: 'अंडाकरी', nameEnglish: 'Anda Curry', price: 180, category: 'egg', isVeg: false },
  { id: 'e7', nameMarathi: 'अंडा मसाला', nameEnglish: 'Anda Masala', price: 140, category: 'egg', isVeg: false },

  // FISH
  { id: 'f1', nameMarathi: 'मच्छ फ्राय', nameEnglish: 'Fish Fry', price: 140, category: 'fish', isVeg: false },
  { id: 'f2', nameMarathi: 'मच्छ रोस्ट', nameEnglish: 'Fish Roast', price: 140, category: 'fish', isVeg: false },
  { id: 'f3', nameMarathi: 'मच्छ मसाला', nameEnglish: 'Fish Masala', price: 140, category: 'fish', isVeg: false },
  { id: 'f4', nameMarathi: 'मच्छ थाळी', nameEnglish: 'Fish Thali', price: 250, category: 'fish', isVeg: false },

  // ROTI / BREAD
  { id: 'ro1', nameMarathi: 'तंदुर रोटी', nameEnglish: 'Tandur Roti', price: 14, category: 'roti', isVeg: true },
  { id: 'ro2', nameMarathi: 'बटर रोटी', nameEnglish: 'Butter Roti', price: 20, category: 'roti', isVeg: true },
  { id: 'ro3', nameMarathi: 'भाकरी', nameEnglish: 'Bhakri', price: 20, category: 'roti', isVeg: true },
  { id: 'ro4', nameMarathi: 'चपाती', nameEnglish: 'Chapati', price: 14, category: 'roti', isVeg: true },
  { id: 'ro5', nameMarathi: 'बटर नान', nameEnglish: 'Butter Naan', price: 60, category: 'roti', isVeg: true },
  { id: 'ro6', nameMarathi: 'गारलिक नान', nameEnglish: 'Garlic Naan', price: 60, category: 'roti', isVeg: true },

  // COLD DRINKS
  { id: 'cd1', nameMarathi: 'पाणी बॉटल', nameEnglish: 'Water Bottle', price: '14/20', category: 'colddrinks', isVeg: true },
  { id: 'cd2', nameMarathi: 'स्पाईट', nameEnglish: 'Sprite', price: 25, category: 'colddrinks', isVeg: true },
  { id: 'cd3', nameMarathi: 'थमसअप', nameEnglish: 'Thums Up', price: 25, category: 'colddrinks', isVeg: true },
  { id: 'cd4', nameMarathi: 'सोडा', nameEnglish: 'Soda', price: 30, category: 'colddrinks', isVeg: true },
  { id: 'cd5', nameMarathi: 'स्ट्रिंग', nameEnglish: 'Sting', price: 30, category: 'colddrinks', isVeg: true },

  // EXTRAS
  { id: 'ex1', nameMarathi: 'सुपवाटी', nameEnglish: 'Supwati', price: 20, category: 'extras', isVeg: true },
  { id: 'ex2', nameMarathi: 'रस्सावाटी', nameEnglish: 'Rassawati', price: 30, category: 'extras', isVeg: true },
  { id: 'ex3', nameMarathi: 'रस्सा प्लेट', nameEnglish: 'Rassa Plate', price: 60, category: 'extras', isVeg: true },
  { id: 'ex4', nameMarathi: 'तडकावाटी', nameEnglish: 'Tadkawati', price: 20, category: 'extras', isVeg: true },
  { id: 'ex5', nameMarathi: 'दाळवाटी', nameEnglish: 'Dalwati', price: 30, category: 'extras', isVeg: true },
];
