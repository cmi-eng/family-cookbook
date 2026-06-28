# Unit Conversions → Hong Kong Metric (g · ml · °C)

Convert **every** measurement to metric. Keep the original in the `original` field.
Round to cooking-sensible numbers (450 g not 453.6 g; 240 ml not 236.6 ml).

## Core constants

### Weight
| From            | To grams |
|-----------------|----------|
| 1 oz            | 28.35 g  |
| 1 lb            | 454 g    |
| 1 stick butter  | 113 g    |
| 1 kg            | 1000 g   |

### Volume
| From               | To ml |
|--------------------|-------|
| 1 tsp              | 5 ml  |
| 1 tbsp (3 tsp)     | 15 ml |
| 1 fl oz            | 30 ml |
| 1 US cup           | 240 ml |
| 1 UK/metric cup    | 250 ml |
| 1 pint (US)        | 473 ml |
| 1 quart (US)       | 946 ml |
| 1 gallon (US)      | 3785 ml |
| 1 stick butter     | 8 tbsp = 120 ml (use weight 113 g instead) |

> When a recipe says "cup" without origin, assume **US cup = 240 ml**. UK/Australian recipes use 250 ml.

### Temperature (°F → °C: subtract 32, ×5/9)
| °F   | °C   | Common oven setting |
|------|------|---------------------|
| 250  | 120  | very low            |
| 300  | 150  | low                 |
| 325  | 165  | moderate-low        |
| 350  | 180  | moderate            |
| 375  | 190  | moderate-hot        |
| 400  | 200  | hot                 |
| 425  | 220  | hot                 |
| 450  | 230  | very hot            |
| 475  | 245  | very hot            |
| 500  | 260  | max                 |

### Length
1 inch = 2.54 cm · 1 cm = 10 mm. (e.g. "cut into 1-inch pieces" → "2.5 cm pieces".)

## Volume → weight for common ingredients (per 1 US cup = 240 ml)

Use these to turn cup/spoon measures of **dry or semi-solid** ingredients into grams. For liquids,
just use the ml value (water-like density ≈ 1 g/ml). Values are typical; ±10% is fine for cooking.

| Ingredient (1 cup)                  | grams | 1 tbsp | Notes |
|-------------------------------------|-------|--------|-------|
| All-purpose / plain flour           | 125 g | 8 g    | spooned & levelled |
| Bread flour                         | 130 g | 8 g    |       |
| Cake flour                          | 115 g | 7 g    |       |
| Whole wheat flour                   | 120 g | 8 g    |       |
| Cornstarch / cornflour              | 120 g | 8 g    |       |
| Granulated white sugar              | 200 g | 12.5 g |       |
| Brown sugar (packed)                | 220 g | 14 g   |       |
| Icing / powdered sugar              | 120 g | 8 g    |       |
| Caster / superfine sugar            | 200 g | 12.5 g | ~same as granulated |
| Honey / maple syrup / golden syrup  | 340 g | 21 g   | dense liquid |
| Butter                              | 227 g | 14 g   | = 1 cup (2 sticks) |
| Vegetable / olive oil               | 218 g | 14 g   | ~0.91 g/ml |
| Milk / water / stock                | 240 g | 15 g   | ≈ ml |
| Heavy cream                         | 238 g | 15 g   |       |
| Yogurt / sour cream                 | 245 g | 15 g   |       |
| Rice (raw, long-grain)              | 195 g | —      |       |
| Rice (raw, jasmine)                 | 200 g | —      |       |
| Rolled oats                         | 90 g  | —      |       |
| Breadcrumbs (dry)                   | 110 g | 7 g    |       |
| Breadcrumbs (fresh / panko)         | 50 g  | —      |       |
| Cocoa powder                        | 85 g  | 5 g    |       |
| Grated parmesan                     | 90 g  | 6 g    |       |
| Shredded cheese (cheddar/moz)       | 110 g | —      |       |
| Chopped nuts                        | 120 g | —      |       |
| Peanut / nut butter                 | 256 g | 16 g   |       |
| Table salt                          | 290 g | 18 g   | 1 tsp ≈ 6 g |
| Kosher salt — Diamond Crystal       | 120 g | 8 g    | 1 tsp ≈ 3 g |
| Kosher salt — Morton                | 240 g | 16 g   | 1 tsp ≈ 5 g |
| Soy sauce / fish sauce / vinegar    | 240 g | 15 g   | ≈ ml |
| Cornmeal (fine / medium)            | 130 g | 8 g    |       |
| Polenta / coarse cornmeal           | 160 g | 10 g   |       |
| Desiccated coconut                  | 80 g  | —      |       |

### Common small-measure shortcuts
- 1 tsp table salt ≈ 6 g (⚠️ kosher salt differs a lot by brand: Diamond Crystal ≈ 3 g, Morton ≈ 5 g per tsp — never assume one number for "kosher salt") · 1 tsp sugar ≈ 4 g · 1 tsp baking powder ≈ 4 g · 1 tsp baking soda ≈ 6 g
- 1 tbsp flour ≈ 8 g · 1 tbsp sugar ≈ 12.5 g · 1 tbsp butter ≈ 14 g · 1 tbsp honey ≈ 21 g
- 1 tbsp cornstarch ≈ 8 g · 1 tbsp soy sauce ≈ 15 ml · 1 tbsp oil ≈ 14 g
- A "pinch" ≈ 0.3 g; "to taste" → leave `qty` empty.
- 1 clove garlic ≈ 3–5 g · 1 medium onion ≈ 150 g · 1 medium egg ≈ 50 g (without shell)
- 1 stick US butter = 113 g = 8 tbsp · 1 knob ≈ 15 g

## Hong Kong / Chinese traditional units (reference only)
Primary output is metric, but you may see or want to note these (e.g. wet-market quantities):
| Unit         | Metric       |
|--------------|--------------|
| 1 斤 (catty) | ≈ 600 g (HK standard; 604.8 g legally) |
| 1 兩 (tael)  | ≈ 37.8 g (1/16 catty) |
| 1 錢 (mace)  | ≈ 3.78 g (1/10 tael) |
| 1 碗 (bowl)  | ≈ 250 ml (rough) |

If a Chinese source gives 斤/兩, convert to grams (1 斤 = 600 g, 1 兩 = 37.5 g) for the metric value
and keep the original in `original`.

## Worked examples
- "1 lb ground pork" → `qty: 450, unit: "g"`, `original: "1 lb"`
- "2 cups all-purpose flour" → `qty: 250, unit: "g"`, `original: "2 cups"`
- "1/2 cup soy sauce" → `qty: 120, unit: "ml"`, `original: "1/2 cup"`
- "3 tbsp honey" → `qty: 63, unit: "g"` (or `45 ml`), `original: "3 tbsp"`
- "Bake at 375°F" → step text reads "Bake at 190°C", `original` note "375°F"
- "1 stick butter" → `qty: 113, unit: "g"`, `original: "1 stick"`
- "半斤蝦" → `qty: 300, unit: "g"`, `original: "半斤"`
