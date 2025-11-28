import { useState, useEffect, useMemo } from 'react';
import './index.css'; // Make sure this imports the Tailwind CSS directives

// --- Type Definitions ---
interface Food {
  brand: string;
  kcal_per_100g: number;
}

interface FoodData {
  dry_food: Food[];
  wet_food: Food[];
}

// --- Constants ---
const LIFE_STAGE_FACTORS: Record<string, number> = {
  'Kitten (0-4 months)': 2.5,
  'Kitten (4-12 months)': 2.0,
  'Neutered Adult': 1.2,
  'Intact Adult': 1.4,
  'Weight Loss': 0.8,
  'Weight Gain': 1.8,
  'Pregnant': 2.0, // Can be up to 3.0
  'Lactating': 3.0, // Can be 2.0-6.0 depending on litter size
};

// --- Main Application Component ---
function App() {
  // --- State Management ---
  const [weight, setWeight] = useState<number>(4);
  const [lifeStage, setLifeStage] = useState<string>('Neutered Adult');
  const [foodData, setFoodData] = useState<FoodData | null>(null);

  const [selectedDryFood, setSelectedDryFood] = useState<Food | null>(null);
  const [selectedWetFood, setSelectedWetFood] = useState<Food | null>(null);

  const [calculationMode, setCalculationMode] = useState<'gap' | 'calc_dry' | 'calc_wet'>('gap');
  const [dryFoodGrams, setDryFoodGrams] = useState<number | ''>('');
  const [wetFoodGrams, setWetFoodGrams] = useState<number | ''>('');

  // --- Data Fetching Effect ---
  useEffect(() => {
    fetch('/food_data.json')
      .then(res => res.json())
      .then((data: FoodData) => {
        setFoodData(data);
        // Set default selections
        if (data.dry_food.length > 0) {
          setSelectedDryFood(data.dry_food[0]);
        }
        if (data.wet_food.length > 0) {
          setSelectedWetFood(data.wet_food[0]);
        }
      })
      .catch(error => console.error("Failed to load food data:", error));
  }, []);

  // --- Core Calculations (Memoized for performance) ---

  // Calculate Resting Energy Requirement (RER)
  const rer = useMemo(() => {
    if (weight > 0) {
      return 70 * Math.pow(weight, 0.75);
    }
    return 0;
  }, [weight]);

  // Calculate total daily calorie needs
  const dailyCalories = useMemo(() => {
    const factor = LIFE_STAGE_FACTORS[lifeStage] || 1.2;
    return rer * factor;
  }, [rer, lifeStage]);

  // --- Derived State for UI Calculations ---
  const calculationResult = useMemo(() => {
    if (!selectedDryFood || !selectedWetFood) {
      return { isValid: false, message: "请先选择猫粮品牌" };
    }

    const dryGrams = Number(dryFoodGrams) || 0;
    const wetGrams = Number(wetFoodGrams) || 0;
    const dryFoodCalories = (dryGrams / 100) * selectedDryFood.kcal_per_100g;
    const wetFoodCalories = (wetGrams / 100) * selectedWetFood.kcal_per_100g;

    switch (calculationMode) {
      case 'gap':
        if (dryFoodGrams === '' && wetFoodGrams === '') return { isValid: false, message: "请输入干粮或湿粮的克数" };
        const totalIntake = dryFoodCalories + wetFoodCalories;
        const gap = totalIntake - dailyCalories;
        const gapMessage = gap >= 0 
          ? `热量盈余 ${gap.toFixed(0)} 大卡` 
          : `热量缺口 ${(-gap).toFixed(0)} 大卡`;
        return { 
          isValid: true, 
          message: `总摄入 ${totalIntake.toFixed(0)} 大卡。${gapMessage}`
        };

      case 'calc_dry':
        if (wetFoodGrams === '') return { isValid: false, message: "请输入湿粮克数" };
        const remainingCaloriesForDry = dailyCalories - wetFoodCalories;
        if (remainingCaloriesForDry <= 0) {
          return { isValid: true, message: `仅喂食 ${wetGrams}g 湿粮已满足甚至超过今日热量所需！` };
        }
        const neededDryGrams = (remainingCaloriesForDry / selectedDryFood.kcal_per_100g) * 100;
        return { 
          isValid: true, 
          message: `还需喂食 ${neededDryGrams.toFixed(1)} 克干粮`
        };

      case 'calc_wet':
        if (dryFoodGrams === '') return { isValid: false, message: "请输入干粮克数" };
        const remainingCaloriesForWet = dailyCalories - dryFoodCalories;
        if (remainingCaloriesForWet <= 0) {
          return { isValid: true, message: `仅喂食 ${dryGrams}g 干粮已满足甚至超过今日热量所需！` };
        }
        const neededWetGrams = (remainingCaloriesForWet / selectedWetFood.kcal_per_100g) * 100;
        return { 
          isValid: true, 
          message: `还需喂食 ${neededWetGrams.toFixed(1)} 克湿粮` 
        };

      default:
        return { isValid: false, message: "请选择计算模式" };
    }

  }, [calculationMode, dailyCalories, dryFoodGrams, wetFoodGrams, selectedDryFood, selectedWetFood]);


  // --- UI Rendering ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Header --- */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">猫咪热量计算器</h1>
          <p className="text-slate-500 mt-2">科学喂养，从一顿一饭开始</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Left Panel: Inputs --- */}
          <div className="space-y-8 p-6 bg-white rounded-2xl shadow-sm">
            {/* Step 1: Cat Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">1. 猫咪信息</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-slate-600 mb-1">体重 (kg)</label>
                  <input type="number" id="weight" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="lifeStage" className="block text-sm font-medium text-slate-600 mb-1">生命阶段</label>
                  <select id="lifeStage" value={lifeStage} onChange={e => setLifeStage(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    {Object.keys(LIFE_STAGE_FACTORS).map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Step 2: Food Selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">2. 猫粮配置</h2>
              {!foodData && <p className="text-slate-500">正在加载猫粮数据...</p>}
              {foodData && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="dryFood" className="block text-sm font-medium text-slate-600 mb-1">选择干粮品牌</label>
                    <select id="dryFood" onChange={e => setSelectedDryFood(foodData.dry_food.find(f => f.brand === e.target.value) || null)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      {foodData.dry_food.map(food => (
                        <option key={food.brand} value={food.brand}>{food.brand} ({food.kcal_per_100g} kcal/100g)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="wetFood" className="block text-sm font-medium text-slate-600 mb-1">选择湿粮品牌</label>
                    <select id="wetFood" onChange={e => setSelectedWetFood(foodData.wet_food.find(f => f.brand === e.target.value) || null)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      {foodData.wet_food.map(food => (
                        <option key={food.brand} value={food.brand}>{food.brand} ({food.kcal_per_100g} kcal/100g)</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- Right Panel: Calculations --- */}
          <div className="space-y-8 p-6 bg-white rounded-2xl shadow-sm">
            {/* Calorie Needs Display */}
            <div className="text-center bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-700">每日所需热量 (DER)</h3>
              <p className="text-4xl font-bold text-indigo-600 my-2">{dailyCalories.toFixed(0)} <span className="text-2xl">大卡</span></p>
              <p className="text-xs text-slate-500">(RER: {rer.toFixed(0)} kcal × {LIFE_STAGE_FACTORS[lifeStage]})</p>
            </div>

            {/* Calculation Mode & Inputs */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">3. 喂食方案计算</h2>
              <div className="grid grid-cols-3 gap-2 rounded-md bg-slate-100 p-1 mb-4">
                {(['gap', 'calc_dry', 'calc_wet'] as const).map(mode => (
                  <button key={mode} onClick={() => setCalculationMode(mode)} className={`px-2 py-1 text-sm font-medium rounded ${calculationMode === mode ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}>
                    {mode === 'gap' && '计算缺口'}
                    {mode === 'calc_dry' && '计算干粮'}
                    {mode === 'calc_wet' && '计算湿粮'}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Wet Food Input */}
                <div style={{ display: calculationMode === 'gap' || calculationMode === 'calc_dry' ? 'block' : 'none' }}>
                  <label htmlFor="wetFoodGrams" className="block text-sm font-medium text-slate-600 mb-1">湿粮喂食量 (g)</label>
                  <input type="number" id="wetFoodGrams" value={wetFoodGrams} onChange={e => setWetFoodGrams(e.target.value === '' ? '' : Number(e.target.value))} placeholder="输入湿粮克数" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                {/* Dry Food Input */}
                <div style={{ display: calculationMode === 'gap' || calculationMode === 'calc_wet' ? 'block' : 'none' }}>
                  <label htmlFor="dryFoodGrams" className="block text-sm font-medium text-slate-600 mb-1">干粮喂食量 (g)</label>
                  <input type="number" id="dryFoodGrams" value={dryFoodGrams} onChange={e => setDryFoodGrams(e.target.value === '' ? '' : Number(e.target.value))} placeholder="输入干粮克数" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
            </div>

            {/* Result Display */}
            {calculationResult.isValid && (
              <div className="text-center bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">计算结果</h3>
                <p className="text-2xl font-semibold text-green-700 my-2">{calculationResult.message}</p>
              </div>
            )}
          </div>

        </div>
        <footer className="text-center mt-12 text-xs text-slate-400">
          <p>免责声明：本计算器结果仅供参考，不能替代专业兽医的建议。猫咪的实际能量需求会因个体差异、活动量等因素而变化。</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
