// 此脚本是用来获取初始阈值
// 调整公式为：adjustedDifficulty = difficulty.get() + ((accuracy - targetAccuracy) / 2) * difficultyRange;
// difficulty.get() 为从上一组试次中获取的难度值，即 coherence
/*-----------------------------------------------------------

1. 被试首先需要完成一个简短的知觉判断测试（大概20个trial）;
2. 根据被试编号将其分配到运动/颜色判断;
3. 程序采用预实验3中的楼梯程序，将最后的 coherence 保存为 data; 
  - 更新：现在是直接保存为全局变量。
4. 获取 data.coherence 并传递给 move.js 和 color.js;

可能的问题：

1. 获取的data如何传递到其他脚本;
2. 脚本加载顺序;
3. coherence 作为时间线变量能否改变或替换;
4. 如何在一个脚本实现运动和颜色阈值的获取;

0409更新：
- 点大小：直径0.1°，3.8pix (这个主观感受太小了)
  - 直径0.15度，约6pix
- 光圈大小：300pix ≈ 8°
- 运动速度：3°/s ≈ 2pix

0416更新
- 把运动的难度4coherence初始值改为：0.04
- 把辨别任务刺激的呈现时间变回原来的1s


0422更新
- 把运动的难度4coherence初始值改为：0.03
- 运动最难条件的目标正确率改为55%
------------------------------------------------------------*/

// 初始化存储数组（每个难度存储两次结果）
window.coherence = new Array(8).fill(0);
window.proportion = new Array(8).fill(0);
var testOutputs = []; 

var coherence_output ={
  motion: window.coherence,
  color: window.proportion,
  testOutput: []
}

var getThreshold = {
  timeline: []
};

let currentCycleMunMotion = 0;
let currentCycleMunColor = 0;
let motionStage = 0;
let colorStage = 0;
let index
let initial_difficulty_motion_easy1 = 0.15
let initial_difficulty_motion_easy2 = 0.11;
let initial_difficulty_motion_hard1 = 0.08;
let initial_difficulty_motion_hard2 = 0.03;
let initial_difficulty_color_easy1 = 0.58;
let initial_difficulty_color_easy2 = 0.56;
let initial_difficulty_color_hard1 = 0.54;
let initial_difficulty_color_hard2 = 0.52;

// 初始化每个难度的保存计数
const saveCounts = {
  easy1: 0,
  easy2: 0,
  hard1: 0,
  hard2: 0
};

// 定义一个函数来计算索引
function getIndex(difficultyType) {
  const startIndices = {
    easy1: 0,
    easy2: 2,
    hard1: 4,
    hard2: 6
  };
  return startIndices[difficultyType] + saveCounts[difficultyType];
}

var randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
};


// 指导语
let instruction_getThreshold = {
  type: jsPsychHtmlKeyboardResponse,
  stimuls: "",
  on_start: function () {
    document.body.style.backgroundColor = "black";
    if (window.userId <= 20) {
      this.stimulus = `
      <div style="text-align: left; color: white; padding: 10px"> 
        <h3 style="text-align: center; font-size: 30px; margin: 10px">欢迎进入实验！</h3>
        <p>在正式开始前，我们将通过一个快速测试为您打造专属的难度水平。<p>
        <p>接下来，屏幕上会呈现一些运动的彩色圆点，</p>
        <p>其中一定比例的点 <span style="font-weight: bold">一致地水平向左或向右运动</span> ，其余点随机方向运动</p >
        <p>您需要<span style="font-weight: bold">忽略点的颜色</span>并在3秒内判断一致的运动方向是向左还是向右:</p >
        <ul>
          <li><span style="font-weight: bold">向左</span>，请按键盘 <span style="font-weight: bold">左键</span></li>
          <li><span style="font-weight: bold">向右</span>，请按键盘 <span style="font-weight: bold">右键</span> </li>
        </ul>
        <p>如有疑问请向主试咨询，没有则按下空格键开始</p>
      </div>`
    } else {
      this.stimulus = `
        <div style="text-align: left; color: white; padding: 10px"> 
          <h3 style="text-align: center; font-size: 30px; margin: 10px">欢迎进入实验！</h3>
          <p>在正式开始前，我们将通过一个快速测试为您打造专属的难度水平。<p>
          <p>接下来，屏幕上会呈现一些运动的圆点，其中一定比例的点为 <span style="color: hsl(0, 50%, 50%)">红色</span> ，其余为 <span style="color: hsl(225, 50%, 50%)">蓝色</span>，</p>
          <p>您需要在3秒内判断 <span style="font-weight: bold">散点图的整体颜色（即大多数点的颜色）是红色还是蓝色 </span>：</p >
          <ul>
            <li>整体为 <span style="color: hsl(0, 50%, 50%)">红色</span>，请按键盘 <span style="color: hsl(0, 50%, 50%)">"D" 键</span></li>
            <li>整体为 <span style="color: hsl(225, 50%, 50%)">蓝色</span>，请按键盘 <span style="color: hsl(225, 50%, 50%)">"k" 键</span> </li>
          </ul>
          <p>如有疑问请向主试咨询，没有则按下空格键开始</p>
        </div>`
    }
  },
  response_ends_trial: true,
  choices: " ",
  data: {
    part: "instruction_getThreshold",
  }
};

//------------------------- 注视点 --------------

var fixation = { 
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p style='font-size: 48px; color: white'>+</p >",
  trial_duration: 500,
  choices: "NO-KEYS",
  data: {
     part: "fixation"
  }
};


//设置难度的调整范围
const StaircaseColor1 = {
  // 这里的 max 和 min 是指难度的最大值和最小值，对应的是信号水平，颜色的难度范围为 0.66 - 0.54 = 0.12（参考之前的预实验）
  max: 0.60,
  min: 0.68, //0.65-0.58=0.07
  difficultyType: 'easy1',  // 最容易的条件
  get: () => {
    return initial_difficulty_color_easy1;
  },
  set: (value) => {
    // 将 value 保留到小数点后两位，并直接赋值给 value
    value = parseFloat(value.toFixed(2));
    initial_difficulty_color_easy1 = value;
    const index = getIndex('easy1');
    window.proportion[index] = value;
    saveCounts.easy1++;
    console.log('colorProportionArray:', window.proportion);
  },
};

const StaircaseColor2 = {
  max: 0.55,
  min: 0.62, //0.62-0.54=0.08
  difficultyType: 'easy2', 
  get: () => {
    return initial_difficulty_color_easy2;
  },
  set: (value) => {
    value = parseFloat(value.toFixed(2));
    initial_difficulty_color_easy2 = value;
    const index = getIndex('easy2');
    window.proportion[index] = value;
    saveCounts.easy2++;
    console.log('colorProportionArray:', window.proportion);
  },
};

const StaircaseColor3 = {
  max: 0.53,
  min: 0.61, //调整范围：0.61-0.53=0.08
  difficultyType: 'hard1',
  get: () => {
    return initial_difficulty_color_hard1;
  },
  set: (value) => {
    value = parseFloat(value.toFixed(2));
    initial_difficulty_color_hard1 = value;
    const index = getIndex('hard1');
    window.proportion[index] = value;
    saveCounts.hard1++;
    console.log('colorProportionArray:', window.proportion);
  },
};

const StaircaseColor4 = {
  max: 0.51,
  min: 0.59, //调整范围：0.59-0.51=0.08
  difficultyType: 'hard2', //最困难的条件
  get: () => {
    return initial_difficulty_color_hard2;
  },
  set: (value) => {
    value = parseFloat(value.toFixed(2));
    initial_difficulty_color_hard2 = value;
    const index = getIndex('hard2');
    window.proportion[index] = value;
    saveCounts.hard2++;
    console.log('colorProportionArray:', window.proportion);
  },
};

const StaircaseMotion1 = {
  max: 0.06,
  min: 0.12, //调整范围：0.12-0.06=0.06
  difficultyType: 'easy1',
  get: () => {
    return initial_difficulty_motion_easy1;
  },
  set: (value) => {
    value = parseFloat(value.toFixed(2));
    initial_difficulty_motion_easy1 = value;
    const index = getIndex('easy1');
    window.coherence[index] = value;
    saveCounts.easy1++;
    console.log('index:', index);
    console.log('motionCoherenceArray:', window.coherence);
  },
};

const StaircaseMotion2 = {
  max: 0.04,
  min: 0.10, //调整范围：0.10-0.04=0.06
  difficultyType: 'easy2',  
  saveCount: 0,
  get: () => {
    return initial_difficulty_motion_easy2;
  },
  set: (value) => {
    value = parseFloat(value.toFixed(2));
    initial_difficulty_motion_easy2 = value;
    const index = getIndex('easy2');
    window.coherence[index] = value;
    saveCounts.easy2++;
    console.log('motionCoherenceArray:', window.coherence);
  },
};

const StaircaseMotion3 = {
  max: 0.03,
  min: 0.09, //调整范围：0.09-0.03=0.06
  difficultyType: 'hard1',
  saveCount: 0,
  get: () => {
    return initial_difficulty_motion_hard1;
  },
  set: (value) => {
    value = parseFloat(value.toFixed(2));
    initial_difficulty_motion_hard1 = value;
    const index = getIndex('hard1');
    window.coherence[index] = value;
    saveCounts.hard1++;
    console.log('motionCoherenceArray:', window.coherence);
  },
};

const StaircaseMotion4 = {
  max: 0.005,
  min: 0.06, //调整范围：0.06-0.005=0.055
  difficultyType: 'hard2',  
  saveCount: 0,
  get: () => {
    return initial_difficulty_motion_hard2;
  },
  set: (value) => {
    value = parseFloat(value.toFixed(2));
    initial_difficulty_motion_hard2 = value;
    const index = getIndex('hard2');
    window.coherence[index] = value;
    saveCounts.hard2++;
    console.log('motionCoherenceArray:', window.coherence);
  },
};

// 正式阶段的单个 trial
let single_trial_color = {
  type: jsPsychRdk,
  number_of_dots: 100,
  dot_color: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"],
  color_change_delay: 0.5,
  dot_color_final: function () { return jsPsych.timelineVariable("dot_color_final") },
  target_color_proportion: function() { return setCurrentDifficultyColor(currentCycleMunColor)},
  choices: ["d", "k"],
  correct_choice: function () { return jsPsych.timelineVariable("correct_choice") },
  dot_radius: 3, //4,
  move_distance: 2, //2.5,
  coherence: 0,
  aperture_width: 300,
  aperture_height: 300,
  //aperture_center_y: 360,
  aperture_center_x: 960, 
  background_color: "black",
  trial_duration: 3000,
  data: {
    part: "color_test",
    correct_response: function () { return jsPsych.timelineVariable("correct_choice") },
    data_label: 'staircase_color',
  },
  on_start: function() {
    /*
    let displayElement = jsPsych.getDisplayElement();
    let elements = displayElement.querySelectorAll("*");
    // 1000毫秒后隐藏刺激
    setTimeout(function() {
      //var elements = displayElement.querySelectorAll("*");
      elements.forEach(function(el) {
        el.style.display = 'none';
      });
    }, 1000);
    */
  },
  on_finish: function(data){
    data.data_label = 'staircase_color';
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    /*// 重新显示元素
    let displayElement = jsPsych.getDisplayElement();
    let elements = displayElement.querySelectorAll("*");
    elements.forEach(function(el) {
      el.style.display = 'inline';
    });
    */
  }
};

let single_trial_motion = {
  type: jsPsychRdk,
  number_of_dots: 100,
  dot_color: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"],
  // motion_change_delay: randomInteger(6, 12),
  coherent_direction: function () { return jsPsych.timelineVariable("coherent_direction")},
  coherence: function() {return setCurrentDifficultyMotion(currentCycleMunMotion)},
  choices: ["ArrowLeft", "ArrowRight"],
  correct_choice: function () { return jsPsych.timelineVariable("correct_choice")},
  dot_radius: 3, //4,
  move_distance: 2, //2.5,
  aperture_width: 300,
  aperture_height: 300,
  //aperture_center_y: 360,
  aperture_center_x: 960,
  background_color: "black",
  trial_duration: 3000,
  data: {
    part: "motion_test",
    correct_response: function () { return jsPsych.timelineVariable("correct_choice")},
    data_label: 'staircase_motion'
  },
  on_start: function() {
    /*
    let displayElement = jsPsych.getDisplayElement();
    let elements = displayElement.querySelectorAll("*");
    // 1000毫秒后隐藏刺激
    setTimeout(function() {
      //var elements = displayElement.querySelectorAll("*");
      elements.forEach(function(el) {
        el.style.display = 'none';
      });
    }, 1000);
    */
  },
  on_finish: function(data){
    data.data_label = 'staircase_motion';
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    /*// 重新显示元素
    let displayElement = jsPsych.getDisplayElement();
    let elements = displayElement.querySelectorAll("*");
    elements.forEach(function(el) {
      el.style.display = 'inline';
    });
    */
  }
};

var feedbackTrial = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 500,
  stimulus: function(){
    // this function will check the accuracy of the last response and use that information to set
    // the stimulus value on each trial.
    let trial_data = jsPsych.data.get().last(1).values()[0];
    let correct = trial_data.correct;
    let rt = trial_data.rt
    if(rt > 0 && rt < 250){
      return `<p style='font-size: 60px; color: yellow'>太快!</p>`; 
    } else if(rt == -1) {
      return `<p style='font-size: 60px; color: yellow'>太慢!</p>`; 
    } else if(correct){
      return `<p style='font-size: 60px; color: green'>正确!</p>`;
    } else {
      return `<p style='font-size: 60px; color: red'>错误!</p>`;
    }
  },
};

var feedback_block_motion = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 2000,
  stimulus: function () {
    let trials = jsPsych.data.get().filter({data_label:'staircase_motion'}).last(12); // 这里必须要写成数字才能变化难度，好奇怪
    let task = trials.select("part").values[0];
    let correct_trials = trials.filter({correct: true });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(trials.select('rt').mean());
    let rt_sd = Math.round(trials.select('rt').sd());
    let coherence = trials.select('coherence').mean(); // 这里保留到小数点后两位

    // 创建一个包含条件和结果的对象
    testOutput = {
      condition: {
        "firstTask": task,
        "motionCoherence": coherence,
      },
      result: {
        "accuracy": accuracy,
        "rt": rt,
        "rt_sd": rt_sd
      }
    };

    // 将 testOutput 添加到 coherence_output 中
    coherence_output.testOutput.push(testOutput);

    console.log(testOutput)
    return `<p style='font-size: 35px; color: white'>您的正确率为： ${accuracy}% 。平均反应时为：${rt}毫秒。</p>`; 
  },
};

var feedback_block_color = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 2000,
  stimulus: function () {
    let trials = jsPsych.data.get().filter({data_label:'staircase_color'}).last(12);
    let task = trials.select("part").values[0];
    let correct_trials = trials.filter({correct: true });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(trials.select('rt').mean());
    let rt_sd = Math.round(trials.select('rt').sd());
    let proportion = trials.select('target_color_proportion').mean()
    // 创建一个包含条件和结果的对象
    testOutput = {
      condition: {
        "task": task,
        "colorProportion": proportion
      },
      result: {
        "accuracy": accuracy,
        "rt": rt,
        "rt_sd": rt_sd
      }
    };
    // 将 testOutput 添加到 coherence_output 中
    coherence_output.testOutput.push(testOutput);
    
    console.log(testOutput)
    return `<p style='font-size: 35px; color: white'>您的正确率为： ${accuracy}% 。平均反应时为：${rt}毫秒。</p>`; 
  },
};

//设置循环的时间线
let cycle_rdk_color = {
  timeline: [fixation, single_trial_color, feedbackTrial],
  timeline_variables: [
    { dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d" },
    { dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k" },
    { dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k" },
    { dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d" }
  ],
  repetitions: 3,
  randomize_order: true
};

let cycle_rdk_motion = {
  timeline: [fixation, single_trial_motion, feedbackTrial],
  timeline_variables: [
    { coherent_direction: 180, correct_choice: "ArrowLeft"},
    { coherent_direction: 0, correct_choice: "ArrowRight" },
    { coherent_direction: 0, correct_choice: "ArrowRight" },
    { coherent_direction: 180, correct_choice: "ArrowLeft" }
  ],
  repetitions: 3,
  randomize_order: true
};

// 加上 block 反馈的时间线
let cycle_color = {
  timeline: [cycle_rdk_color, feedback_block_color],
  on_timeline_finish: function() {
    currentCycleMunColor += 1;
    if(currentCycleMunColor %2 != 0 ){ // 每种条件下循环2次
      colorStage += 1;
    } else {
      colorStage = colorStage
    }
    console.log('current condition number ', colorStage)
  }
};

let cycle_motion = {
  timeline: [cycle_rdk_motion, feedback_block_motion],
  on_timeline_finish: function() {
    currentCycleMunMotion += 1;
    if(currentCycleMunMotion %2 != 0 ){ // 每种条件下循环2次
      motionStage += 1;
    } else {
      motionStage = motionStage
    }
    console.log('current condition number ', motionStage)
  }
};


// generateStaircaseTimeline 为外部调用的函数，用于生成测试阶段的 staircase
let color_easy1 = generateStaircaseTimeline({
  // Your jsPsych instance (required to fetch data)
  jsPsychInstance: jsPsych,
  // The target accurcy (between 0 and 1)
  targetAccuracy: 0.85,
  // The number of cycles to be carried out
  numberOfCycles: 1,
  // The difficulty object
  difficulty: StaircaseColor1,
  // The data label. Must be the same string that you added to the response
  // trials.
  dataLabel: 'staircase_color',
  // And finally your cycle.
  cycle: cycle_color,
});

// 我们的实际目标正确率分别对应 90%，80%，70%和60%
// 在调整过程中，考虑到被试一开始被试对任务不太熟悉，便把对应的目标正确率各降低5%
let color_easy2 = generateStaircaseTimeline({
  jsPsychInstance: jsPsych,
  targetAccuracy: 0.75,
  numberOfCycles: 1,
  difficulty: StaircaseColor2,
  dataLabel: 'staircase_color',
  cycle: cycle_color,
});

let color_hard1 = generateStaircaseTimeline({
  jsPsychInstance: jsPsych,
  targetAccuracy: 0.65,
  numberOfCycles: 1,
  difficulty: StaircaseColor3,
  dataLabel: 'staircase_color',
  cycle: cycle_color,
});

let color_hard2 = generateStaircaseTimeline({
  jsPsychInstance: jsPsych,
  targetAccuracy: 0.55,
  numberOfCycles: 1,
  difficulty: StaircaseColor4,
  dataLabel: 'staircase_color',
  cycle: cycle_color,
});

let motion_easy1 = generateStaircaseTimeline({
  jsPsychInstance: jsPsych,
  targetAccuracy: 0.85,
  numberOfCycles: 1,
  difficulty: StaircaseMotion1,
  dataLabel: 'staircase_motion',
  cycle: cycle_motion,
});

let motion_easy2 = generateStaircaseTimeline({
  jsPsychInstance: jsPsych,
  targetAccuracy: 0.75,
  numberOfCycles: 1,
  difficulty: StaircaseMotion2,
  dataLabel: 'staircase_motion',
  cycle: cycle_motion,
});

let motion_hard1 = generateStaircaseTimeline({
  jsPsychInstance: jsPsych,
  targetAccuracy: 0.65,
  numberOfCycles: 1,
  difficulty: StaircaseMotion3,
  dataLabel: 'staircase_motion',
  cycle: cycle_motion,
});

let motion_hard2 = generateStaircaseTimeline({
  jsPsychInstance: jsPsych,
  targetAccuracy: 0.55,
  numberOfCycles: 1,
  difficulty: StaircaseMotion4,
  dataLabel: 'staircase_motion',
  cycle: cycle_motion,
});

// 定义所有运动/颜色相关的难度组块数组（由 generateStaircaseTimeline 生成）
let all_motion_blocks = [motion_easy1, motion_easy2, motion_hard1, motion_hard2];

let all_color_blocks = [color_easy1, color_easy2, color_hard1, color_hard2];

// 定义与运动/颜色组块对应的难度对象数组（StaircaseMotion 系列对象）
let all_motion_difficulty_blocks = [StaircaseMotion1, StaircaseMotion2, StaircaseMotion3, StaircaseMotion4];

let all_color_difficulty_blocks = [StaircaseColor1, StaircaseColor2, StaircaseColor3, StaircaseColor4];

// 将运动/颜色组块与其对应的难度对象组合成复合对象数组
// 每个复合对象包含：
// - block: 实际的实验组块（由 generateStaircaseTimeline 生成）
// - difficulty: 对应的难度对象（包含 get 方法获取当前难度值）
let combined_motion = all_motion_blocks.map((block, index) => ({
  block, // 当前实验组块
  difficulty: all_motion_difficulty_blocks[index]  // 对应的难度对象
}));

let combined_color = all_color_blocks.map((block, index) => ({
  block, // 当前实验组块
  difficulty: all_color_difficulty_blocks[index]  // 对应的难度对象
}));

// 拆分复合数组为顺序部分和随机部分
// 前4个元素作为固定顺序部分（由易到难）
let sequential_combined_motion = combined_motion.slice(0, 4);
// 后4个元素进行随机打乱（确保每种难度出现一次）
let random_combined_motion = [...combined_motion].slice(0, 4).sort(() => Math.random() - 0.5);
//颜色
let sequential_combined_color = combined_color.slice(0, 4);
let random_combined_color = [...combined_color].slice(0, 4).sort(() => Math.random() - 0.5);

// 合并顺序部分和随机部分，形成完整的实验顺序
let combined_motion_order = sequential_combined_motion.concat(random_combined_motion);
let combined_color_order = sequential_combined_color.concat(random_combined_color);

// 定义函数，获取当前的难度值传递给单个试次
function setCurrentDifficultyMotion(currentCycleMunMotion) {
  // 边界检查：确保 currentCycleMunMotion 在有效范围内
  if (currentCycleMunMotion < 0 || currentCycleMunMotion >= combined_motion_order.length) {
    console.error("Invalid currentCycleMunMotion value:", currentCycleMunMotion);
    return null;
  }
  // 从复合数组中获取当前周期对应的难度对象
  let currentDifficultyObject = combined_motion_order[currentCycleMunMotion].difficulty;
  // 调用难度对象的 get 方法获取当前难度值
  let currentDifficulty = currentDifficultyObject.get();
  console.log("currentDifficultyMotion:" + currentDifficulty);
  return currentDifficulty;
}

function setCurrentDifficultyColor(currentCycleMunColor) {
  if (currentCycleMunColor < 0 || currentCycleMunColor >= combined_color_order.length) {
    console.error("Invalid currentCycleMunColor value:", currentCycleMunColor);
    return null;
  }
  let currentDifficultyObject = combined_color_order[currentCycleMunColor].difficulty;
  let currentDifficulty = currentDifficultyObject.get();
  console.log("currentDifficultyColor:" + currentDifficulty);
  return currentDifficulty;
}

// 提取复合数组中的实验组块，形成最终的实验流程时间线
// 此时顺序已经包含前4个顺序组块 + 后4个随机组块
let motion_order = combined_motion_order.map(item => item.block);
let color_order = combined_color_order.map(item => item.block);

let full_block_motion = {
  timeline: motion_order
};

let full_block_color = {
  timeline: color_order
};

// 根据被试编号组别分配
var group_motion = {
  timeline: [full_block_motion],
  conditional_function: function () {
    if (window.userId <= 20) {
      console.log("move");
      return true;
    } else {
      return false;
    }
  }
};

var group_color = {
  timeline: [full_block_color],
  conditional_function: function () {
    if (window.userId > 20) {
      console.log("color");
      return true;
    } else {
      return false;
    }
  }
};

var assign_group = {
  timeline: [group_motion, group_color]
};

getThreshold = {
  timeline: [instruction_getThreshold, assign_group]
};