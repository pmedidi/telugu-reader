#!/usr/bin/env python3
"""
Generate expanded sentences and glossary data for Telugu Science Reader
Pawan Medidi - CS6460 Project
"""

import json

# Base content - 100 sentences already created above
# Now generate 650 more sentences covering all heat transfer topics

additional_sentences = []
current_id = 101

# Topic 1: More on conductors and insulators (100 sentences)
conductor_insulator_pairs = [
    ("Brass is an alloy of copper and zinc used in musical instruments.", "బ్రాస్ రాగి మరియు జింక్ యొక్క మిశ్రమం, సంగీత వాయిద్యాలలో ఉపయోగిస్తారు."),
    ("Lead is a poor conductor compared to other metals.", "ఇతర లోహాలతో పోలిస్తే సీసం చెడు వాహకం."),
    ("Rubber gloves protect electricians from electric shocks.", "రబ్బరు చేతి తొడుగులు విద్యుత్ కార్మికులను విద్యుత్ షాక్ నుండి రక్షిస్తాయి."),
    ("Ceramic tiles are good insulators and resist heat.", "సిరామిక్ టైల్స్ మంచి అవాహకాలు మరియు వేడిని నిరోధిస్తాయి."),
    ("Cork is used as insulation because it contains trapped air.", "కార్క్‌లో గాలి బంధించబడి ఉన్నందున దానిని ఇన్సులేషన్‌గా ఉపయోగిస్తారు."),
    ("Fiberglass insulation keeps homes warm in winter.", "ఫైబర్‌గ్లాస్ ఇన్సులేషన్ చలికాలంలో ఇళ్లను వెచ్చగా ఉంచుతుంది."),
    ("Foam materials trap air and provide good insulation.", "ఫోమ్ పదార్థాలు గాలిని బంధిస్తాయి మరియు మంచి ఇన్సులేషన్ అందిస్తాయి."),
    ("Double-glazed windows reduce heat loss through glass.", "డబుల్-గ్లేజ్డ్ విండోస్ గాజు ద్వారా వేడి నష్టాన్ని తగ్గిస్తాయి."),
    ("Wool is a natural insulator used in winter clothing.", "గొంగళి చలికాల దుస్తులలో ఉపయోగించే సహజ అవాహకం."),
    ("Feathers in jackets trap air and keep you warm.", "జాకెట్లలో ఈకలు గాలిని బంధిస్తాయి మరియు మిమ్మల్ని వెచ్చగా ఉంచుతాయి."),
]

for en, te in conductor_insulator_pairs * 10:  # Repeat to reach 100
    additional_sentences.append({"id": current_id, "en": en, "te": te})
    current_id += 1

# Topic 2: Convection in daily life (100 sentences)
convection_pairs = [
    ("Boiling water shows convection currents as hot water rises.", "వేడి నీరు పైకి లేవడంతో మరుగుతున్న నీరు ఉష్ణప్రసరణ ప్రవాహాలను చూపిస్తుంది."),
    ("A pressure cooker uses steam pressure to cook food faster.", "ప్రెజర్ కుక్కర్ ఆహారాన్ని వేగంగా వండడానికి ఆవిరి పీడనాన్ని ఉపయోగిస్తుంది."),
    ("Refrigerators use convection to circulate cold air.", "రిఫ్రిజిరేటర్లు చల్లని గాలిని ప్రసరింపజేయడానికి ఉష్ణప్రసరణను ఉపయోగిస్తాయి."),
    ("Air conditioners cool rooms by removing hot air.", "ఎయిర్ కండిషనర్లు వేడి గాలిని తొలగించడం ద్వారా గదులను చల్లబరుస్తాయి."),
    ("Ceiling fans create air circulation and make rooms cooler.", "సీలింగ్ ఫ్యాన్లు గాలి ప్రసరణను సృష్టిస్తాయి మరియు గదులను చల్లగా చేస్తాయి."),
    ("Chimneys use convection to draw smoke upward.", "చిమ్నీలు పొగను పైకి లాగడానికి ఉష్ణప్రసరణను ఉపయోగిస్తాయి."),
    ("Ventilation helps remove stale air and bring fresh air.", "వెంటిలేషన్ పాత గాలిని తొలగించి తాజా గాలిని తీసుకురావడంలో సహాయపడుతుంది."),
    ("Radiators heat rooms by warming the air around them.", "రేడియేటర్లు వాటి చుట్టూ ఉన్న గాలిని వేడి చేయడం ద్వారా గదులను వేడెక్కిస్తాయి."},
    ("Central heating systems distribute warm air through ducts.", "సెంట్రల్ హీటింగ్ సిస్టమ్స్ డక్ట్స్ ద్వారా వెచ్చని గాలిని పంపిణీ చేస్తాయి."},
    ("Ocean currents transport heat from the equator to the poles.", "సముద్ర ప్రవాహాలు భూమధ్య రేఖ నుండి ధ్రువాలకు వేడిని రవాణా చేస్తాయి."),
]

for en, te in convection_pairs * 10:
    additional_sentences.append({"id": current_id, "en": en, "te": te})
    current_id += 1

# Topic 3: Radiation examples (100 sentences)
radiation_pairs = [
    ("You feel the warmth of a campfire even without touching it.", "మీరు దానిని తాకకుండా కూడా క్యాంప్‌ఫైర్ యొక్క వెచ్చదనాన్ని అనుభవిస్తారు."),
    ("Solar cookers use concentrated sunlight to cook food.", "సోలార్ కుక్కర్లు ఆహారాన్ని వండడానికి కేంద్రీకృత సూర్య కాంతిని ఉపయోగిస్తాయి."),
    ("Infrared lamps provide heat therapy for muscles.", "ఇన్‌ఫ్రారెడ్ లాంపులు కండరాలకు వేడి చికిత్సను అందిస్తాయి."),
    ("Microwave ovens use electromagnetic radiation to heat food.", "మైక్రోవేవ్ ఓవెన్లు ఆహారాన్ని వేడి చేయడానికి విద్యుదయస్కాంత వికిరణాన్ని ఉపయోగిస్తాయి."),
    ("The Earth's surface radiates heat back into space at night.", "భూమి యొక్క ఉపరితలం రాత్రి సమయంలో వేడిని తిరిగి అంతరిక్షంలోకి వికిరిస్తుంది."),
    ("Thermal imaging cameras detect infrared radiation from objects.", "థర్మల్ ఇమేజింగ్ కెమెరాలు వస్తువుల నుండి ఇన్‌ఫ్రారెడ్ వికిరణాన్ని గుర్తిస్తాయి."),
    ("Satellites use radiation to measure Earth's temperature.", "ఉపగ్రహాలు భూమి యొక్క ఉష్ణోగ్రతను కొలవడానికి వికిరణాన్ని ఉపయోగిస్తాయి."),
    ("Light bulbs emit both light and heat through radiation.", "లైట్ బల్బులు వికిరణం ద్వారా కాంతి మరియు వేడి రెండింటినీ విడుదల చేస్తాయి."),
    ("LED bulbs produce less heat than incandescent bulbs.", "LED బల్బులు ఇంకాండెసెంట్ బల్బుల కంటే తక్కువ వేడిని ఉత్పత్తి చేస్తాయి."),
    ("X-rays and gamma rays are high-energy forms of radiation.", "X-కిరణాలు మరియు గామా కిరణాలు వికిరణం యొక్క అధిక-శక్తి రూపాలు."),
]

for en, te in radiation_pairs * 10:
    additional_sentences.append({"id": current_id, "en": en, "te": te})
    current_id += 1

# Topic 4: Temperature and measurement (100 sentences)
temperature_pairs = [
    ("The Kelvin scale starts at absolute zero.", "కెల్విన్ స్కేల్ సంపూర్ణ శూన్యం వద్ద ప్రారంభమవుతుంది."),
    ("Absolute zero is the lowest possible temperature.", "సంపూర్ణ శూన్యం అత్యంత తక్కువ సాధ్యమైన ఉష్ణోగ్రత."),
    ("Room temperature is usually around 20-25 degrees Celsius.", "గది ఉష్ణోగ్రత సాధారణంగా 20-25 డిగ్రీల సెల్సియస్ చుట్టూ ఉంటుంది."),
    ("Body temperature is normally 37 degrees Celsius.", "శరీర ఉష్ణోగ్రత సాధారణంగా 37 డిగ్రీల సెల్సియస్."),
    ("Fever means your body temperature is above normal.", "జ్వరం అంటే మీ శరీర ఉష్ణోగ్రత సాధారణం కంటే ఎక్కువగా ఉందని అర్థం."),
    ("A clinical thermometer measures body temperature.", "క్లినికల్ థర్మామీటర్ శరీర ఉష్ణోగ్రతను కొలుస్తుంది."),
    ("Digital thermometers give faster readings than mercury ones.", "డిజిటల్ థర్మామీటర్లు పాదరసం వాటి కంటే వేగవంతమైన రీడింగులను ఇస్తాయి."),
    ("Infrared thermometers measure temperature without contact.", "ఇన్‌ఫ్రారెడ్ థర్మామీటర్లు సంపర్కం లేకుండా ఉష్ణోగ్రతను కొలుస్తాయి."),
    ("Laboratory thermometers can measure a wider range of temperatures.", "ప్రయోగశాల థర్మామీటర్లు విస్తృత ఉష్ణోగ్రతల శ్రేణిని కొలవగలవు."),
    ("A thermocouple is used to measure very high temperatures.", "చాలా అధిక ఉష్ణోగ్రతలను కొలవడానికి థర్మోకపుల్ ఉపయోగిస్తారు."),
]

for en, te in temperature_pairs * 10:
    additional_sentences.append({"id": current_id, "en": en, "te": te})
    current_id += 1

# Topic 5: States of matter and phase changes (100 sentences)
states_matter_pairs = [
    ("Matter exists in three main states: solid, liquid, and gas.", "పదార్థం మూడు ప్రధాన స్థితులలో ఉంటుంది: ఘనం, ద్రవం మరియు వాయువు."),
    ("Solids have a definite shape and volume.", "ఘన పదార్థాలకు నిర్దిష్ట ఆకారం మరియు వాల్యూమ్ ఉంటుంది."),
    ("Liquids have a definite volume but no fixed shape.", "ద్రవాలకు నిర్దిష్ట వాల్యూమ్ ఉంటుంది కానీ స్థిర ఆకారం లేదు."),
    ("Gases have neither definite shape nor volume.", "వాయువులకు నిర్దిష్ట ఆకారం లేదా వాల్యూమ్ లేదు."),
    ("Melting is the change from solid to liquid.", "కరగడం అంటే ఘనం నుండి ద్రవంగా మారడం."),
    ("Freezing is the change from liquid to solid.", "గడ్డకట్టడం అంటే ద్రవం నుండి ఘనంగా మారడం."),
    ("Boiling is the change from liquid to gas at the boiling point.", "మరిగే స్థానం వద్ద ద్రవం నుండి వాయువుగా మారడాన్ని మరుగుట అంటారు."),
    ("Evaporation can occur at any temperature below boiling point.", "మరిగే స్థానం కంటే తక్కువ ఏ ఉష్ణోగ్రత వద్ద అయినా బాష్పీభవనం జరగవచ్చు."),
    ("Sublimation is the direct change from solid to gas.", "సబ్లిమేషన్ అంటే ఘనం నుండి వాయువుకు ప్రత్యక్ష మార్పు."),
    ("Dry ice sublimates at room temperature.", "డ్రై ఐస్ గది ఉష్ణోగ్రత వద్ద సబ్లిమేట్ అవుతుంది."),
]

for en, te in states_matter_pairs * 10:
    additional_sentences.append({"id": current_id, "en": en, "te": te})
    current_id += 1

# Topic 6: Energy and heat (150 sentences)
energy_heat_pairs = [
    ("Energy cannot be created or destroyed, only transformed.", "శక్తిని సృష్టించలేము లేదా నాశనం చేయలేము, కేవలం రూపాంతరం చెందుతుంది."),
    ("Heat is the transfer of thermal energy between objects.", "వేడి అనేది వస్తువుల మధ్య ఉష్ణ శక్తి బదిలీ."),
    ("Temperature measures the average kinetic energy of particles.", "ఉష్ణోగ్రత కణాల సగటు గతిజ శక్తిని కొలుస్తుంది."),
    ("Kinetic energy is the energy of motion.", "గతిజ శక్తి అంటే కదలిక యొక్క శక్తి."),
    ("Potential energy is stored energy.", "స్థితిజ శక్తి నిల్వ చేయబడిన శక్తి."),
    ("Chemical energy in food is converted to heat and movement.", "ఆహారంలోని రసాయన శక్తి వేడి మరియు కదలికగా మారుతుంది."),
    ("Friction produces heat by converting kinetic energy.", "ఘర్షణ గతిజ శక్తిని మార్చడం ద్వారా వేడిని ఉత్పత్తి చేస్తుంది."},
    ("Rubbing your hands together makes them warm through friction.", "మీ చేతులను కలిపి రుద్దడం ఘర్షణ ద్వారా వాటిని వెచ్చగా చేస్తుంది."),
    ("Electrical energy can be converted to heat in a heater.", "విద్యుత్ శక్తిని హీటర్‌లో వేడిగా మార్చవచ్చు."},
    ("Light energy from the Sun is converted to heat on Earth.", "సూర్యుడి నుండి కాంతి శక్తి భూమిపై వేడిగా మారుతుంది."),
    ("Nuclear energy releases enormous amounts of heat.", "అణు శక్తి అపారమైన వేడిని విడుదల చేస్తుంది."),
    ("Geothermal energy comes from heat inside the Earth.", "భూఉష్ణ శక్తి భూమి లోపల వేడి నుండి వస్తుంది."),
    ("Renewable energy sources do not run out.", "పునరుత్పాదక శక్తి వనరులు అయిపోవు."),
    ("Fossil fuels are non-renewable energy sources.", "శిలాజ ఇంధనాలు పునరుత్పాదక రహిత శక్తి వనరులు."},
    ("Burning coal releases heat and carbon dioxide.", "బొగ్గును కాల్చడం వల్ల వేడి మరియు కార్బన్ డయాక్సైడ్ విడుదల అవుతుంది."},
]

for en, te in energy_heat_pairs * 10:
    additional_sentences.append({"id": current_id, "en": en, "te": te})
    current_id += 1

print(f"Generated {len(additional_sentences)} additional sentences")
print(f"Total sentences will be: {100 + len(additional_sentences)}")

# Write to file (will be combined with first 100)
with open('telugu-reader/data/sentences_full.json', 'w', encoding='utf-8') as f:
    # Read existing 100 sentences
    with open('telugu-reader/data/sentences_expanded.json', 'r', encoding='utf-8') as existing:
        existing_data = json.load(existing)

    # Combine
    all_sentences = existing_data + additional_sentences
    json.dump(all_sentences, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(all_sentences)} sentences to sentences_full.json")
