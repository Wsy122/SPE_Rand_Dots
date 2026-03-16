/*---------------------------------------------------------------------------------
这段代码主要用于执行颜色条件下的实验，即人物标签与颜色匹配，之后进行散点群整体颜色判断
在当前的版本中，人物改为 “我”，“他/她”
并且，标签会分别于 4 种不同难度水平的散点图进行匹配
不同的难度条件随机呈现
匹配任务：2*16 个练习 trial，2 * 16 * 4 = 128 个正式 trial 
随机动点任务：2*8 = 16 个练习 trial，4 * 8 * 4 = 128 个正式 trial 每种条件40个trial
- 更新：每种条件24个trial
- 匹配任务：2*16=32个练习，24*16=384个正式/8 block
- 随机动点任务：2*8=16个练习，24*8=192个正式/4 block
-----------------------------------------------------------------------------------*/
var color = {
  timeline: []
};

var currentBlock = 1

// 定义一个函数来处理条件匹配和更新proportion值
function updateProportion(arr) {
  for (let i in arr) {
    const proportion = arr[i].target_color_proportion;
    switch (proportion) {
      case 0.64:
        arr[i].target_color_proportion = window.proportion[1];
        break;
      case 0.59:
        arr[i].target_color_proportion = window.proportion[3];
        break;
      case 0.54:
        arr[i].target_color_proportion = window.proportion[5];
        break;
      case 0.51:
        arr[i].target_color_proportion = window.proportion[7];
        break;
    }
  }
}



//--------------------匹配判断------------------------
//匹配判断包含：指导语，示例，练习和正式任务

// 指导语
var instruction_match = {
  type: jsPsychHtmlKeyboardResponse,
  stimuls: "",
  on_start: function () {
    if (window.subjSex) { 
      if (window.subjSex == "男") {
        labelVar = "他";
      } else if (window.subjSex == "女") {
        labelVar = "她";
      }
    } else {
      labelVar = "TA";
    };
    document.body.style.backgroundColor = "black";
    if (userId % 2 === 0) {
      this.stimulus = `
        <div style="text-align: left; color: white; padding: 10px"> 
          <h3 style="text-align: center; font-size: 30px; margin: 10px">任务一：匹配判断</h3>
          <p>接下来，屏幕上会呈现一些运动的圆点，其中一定比例的点为 <span style="color: hsl(0, 50%, 50%)">红色</span> ，其余为<span style="color: hsl(225, 50%, 50%)">蓝色</span> 。</p>
          <p>同时散点图的下方会出现 "我" 或 "${labelVar}" 的文字标签。</p >
          <p>如果大多数点的颜色为<span style="color: hsl(0, 50%, 50%)">红色</span>代表<span style="color: hsl(0, 50%, 50%)">你自己</span> ，为<span style="color: hsl(225, 50%, 50%)">蓝色</span> 代表 <span style="color: hsl(225, 50%, 50%)">他人</span>。</p >
          <p>您需要在3秒内判断 <span style="font-weight: bold">散点图的整体颜色与文字是否匹配</span> 。</p >
          <ul>
            <li><span style="color: hsl(135, 50%, 50%)">匹配</span>，请按键盘 <span style="color: hsl(135, 50%, 50%)">"F" 键</span>；</li>
            <li><span style="color: red">不匹配</span>，请按键盘 <span style="color: red">"J" 键</span> </li>
          </ul>
        </div>`;
    } else {
      this.stimulus = `
        <div style="text-align: left; color: white; padding: 10px"> 
          <h3 style="text-align: center; font-size: 30px; margin: 10px">任务一：匹配判断</h3>
          <p>接下来，屏幕上会呈现一些运动的圆点，其中一定比例的点为<span style="color: hsl(0, 50%, 50%)">红色</span> ，其余为<span style="color: hsl(225, 50%, 50%)">蓝色</span> 。</p>
          <p>同时散点图的下方会出现 "我" 或 "${labelVar}"  的文字标签。</p >
          <p>如果大多数点的颜色为<span style="color: hsl(225, 50%, 50%)">蓝色</span>代表<span style="color: hsl(225, 50%, 50%)">你自己</span> ，为<span style="color: hsl(0, 50%, 50%)">红色</span>代表<span style="color: hsl(0, 50%, 50%)">他人</span>。</p >
          <p>您需要在3秒内判断 <span style="font-weight: bold">散点图的整体颜色与文字是否匹配</span> 。</p >
          <ul>
            <li><span style="color: hsl(135, 50%, 50%)">匹配</span>，请按键盘 <span style="color: hsl(135, 50%, 50%)">"F" 键</span>；</li>
            <li><span style="color: red">不匹配</span>，请按键盘 <span style="color: red">"J" 键</span> </li>
          </ul>
        </div>`;
    }
  },
  response_ends_trial: true,
  choices: " ",
  data: {
    part: "instruction_match",
  },
  on_finish: function() {
    console.log("subjSexTest:", window.subjSex, "lable:", labelVar)
    if (testMode) {
      textMun = true
    } else {
      textMun = false
    }
    return textMun
  }
};

color.timeline.push(instruction_match);


// 练习

var instruction_match_practice = {
  type: jsPsychHtmlKeyboardResponse,
  stimuls: "",
  on_start: function () {
    //document.body.style.backgroundColor = "black";
    if (userId % 2 === 0) {
      this.stimulus = `
        <div style="text-align: left; color: white; padding: 10px">  
          <h3 style="text-align: center; font-size: 30px; margin: 10px;">练习阶段</h3>
          <p>整体颜色为<span style="color: hsl(0, 50%, 50%)">红色</span>代表<span style="color: hsl(0, 50%, 50%)">你自己</span> ，为<span style="color: hsl(225, 50%, 50%)">蓝色</span>代表<span style="color: hsl(225, 50%, 50%)">他人</span>。</p >
          <p>您需要在3秒内判断 <span style="font-weight: bold">散点图的整体颜色与文字是否匹配</span>，<span style="color: hsl(135, 50%, 50%);">匹配</span> 按 <span style="color: hsl(135, 50%, 50%);">"F" 键</span>；<span style="color: red;">不匹配</span> 按 <span style="color: red;">"J" 键</span> </p >
          <p>正确率达到 65% 及以上才能进入下一个阶段</p >
          <p>请把左手食指放在 "F" 键上，右手食指放在 "J" 键上</p >
          <p>请按下空格键开始练习</p >
        </div>`;
    } else {
      this.stimulus = `
        <div style="text-align: left; color: white; padding: 10px">  
          <h3 style="text-align: center; font-size: 30px; margin: 10px;">练习阶段</h3>
          <p>整体颜色为<span style="color: hsl(225, 50%, 50%)">蓝色</span>代表<span style="color: hsl(225, 50%, 50%)">你自己</span> ，为<span style="color: hsl(0, 50%, 50%)">红色</span>代表<span style="color: hsl(0, 50%, 50%)">他人</span>。</p >
          <p>您需要在3秒内判断 <span style="font-weight: bold">散点图的整体颜色与文字是否匹配</span>，<span style="color: hsl(135, 50%, 50%);">匹配</span> 按 <span style="color: hsl(135, 50%, 50%);">"F" 键</span>；<span style="color: red;">不匹配</span> 按 <span style="color: red;">"J" 键</span> </p >
          <p>正确率达到 65% 及以上才能进入下一个阶段</p >
          <p>请把左手食指放在 "F" 键上，右手食指放在 "J" 键上</p >
          <p>请按下空格键开始练习</p >
        </div>`;
    }
  },
  response_ends_trial: true,
  choices: " ",
  data: {
    part: "instruction_match_practice",
  }
};

//color.timeline.push(instruction_practice);

var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p style='font-size: 48px; color: white'>+</p >",
  trial_duration: 500,
  choices: "NO-KEYS",
  data: {
    part: "fixation"
  }
};

//匹配判断任务的不同条件(subjectId 为偶数，则红色代表自己；subjectId 为奇数，则蓝色代表自己)

let conditions_match_selfRed = [
  { target_color_proportion: 0.51, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:4},
  { target_color_proportion: 0.51, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other", difficulty:4},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:3},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other", difficulty:3},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:2},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other", difficulty:2},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:1},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other", difficulty:1},
  { target_color_proportion: 0.51, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:4},
  { target_color_proportion: 0.51, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:4},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:3},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:3},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:2},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:2},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:1},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:1},
];

let conditions_match_selfBlue = [
  { target_color_proportion: 0.51, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:4},
  { target_color_proportion: 0.51, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other", difficulty:4},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:3},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other",difficulty:3},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:2},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other", difficulty:2},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "我", correct_choice: "f", isMatch: "match", association: "self", difficulty:1},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "我", correct_choice: "j", isMatch: "mismatch", association: "other", difficulty:1},
  { target_color_proportion: 0.51, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:4},
  { target_color_proportion: 0.51, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:4},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:3},
  { target_color_proportion: 0.54, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:3},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:2},
  { target_color_proportion: 0.59, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:2},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], label: "他", correct_choice: "f", isMatch: "match", association: "other", difficulty:1},
  { target_color_proportion: 0.64, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], label: "他", correct_choice: "j", isMatch: "mismatch", association: "self", difficulty:1}
]

// 设置匹配任务的主要刺激

var match_RDK = {
  type: jsPsychRdk,
  canvas_height: 420,
  number_of_apertures: 1,
  number_of_dots: 100,
  //post_trial_gap: 500,
  dot_color: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"],
  dot_color_final: function () { return jsPsych.timelineVariable("dot_color_final") },
  target_color_proportion: function () { return jsPsych.timelineVariable("target_color_proportion") },
  color_change_delay: 0.5,
  choices: ["f", "j"],
  correct_choice: function () { return jsPsych.timelineVariable("correct_choice") },
  coherent_direction: 0,
  coherence: 0,
  dot_radius: 3, 
  move_distance: 2, 
  aperture_width: 300,
  aperture_height: 300,
  aperture_center_x: 960,
  aperture_center_y: 250,
  background_color: "black",
  trial_duration: 3000,
  data: {
    part: "match_RDK",
    task: "response",
    difficulty: function () { return jsPsych.timelineVariable("difficulty") },
    //correct_response: function () { return jsPsych.timelineVariable("correct_choice") },
    isMatch: function () { return jsPsych.timelineVariable("isMatch") },
    association: function () { return jsPsych.timelineVariable("association") },
    label: function () { return jsPsych.timelineVariable("label") },
  },
  on_start: function () {

    // 正式阶段——替换最后 8 个元素的 label 属性 （索引从 8-15）
    for (let i = 8; i < 16; i++) {
      conditions_match_selfRed[i].label = `${labelVar}`;
      conditions_match_selfBlue[i].label = `${labelVar}`;
    };

    //替换proportion值
    updateProportion(conditions_match_selfBlue);
    updateProportion(conditions_match_selfRed);
  
    var displayElement = jsPsych.getDisplayElement();
    
    //创建注视点
    var textDiv = document.createElement("div");
    textDiv.textContent = "+",

    textDiv.style.position = "absolute";
    textDiv.style.fontSize = "48px";
    textDiv.style.top = "50%";          // 从顶部50%位置开始
    textDiv.style.left = "50%";         // 从左侧50%位置开始
    textDiv.style.transform = "translate(-50%, -50%)"; 
    textDiv.style.color = "white";
    displayElement.appendChild(textDiv);


    //创建图片标签
    var img = document.createElement("img");
    // 根据label变量选择图片路径
    const label = jsPsych.timelineVariable("label");
    img.src = (() => {
      switch(jsPsych.timelineVariable("label")) {
        case "我": return "img/self.png";
        case "他": return "img/he.png";    // 男性他人
        case "她": return "img/she.png";  // 女性他人
        default: console.error("未知标签");
      }
    })();
    
    // 图片样式设置
    img.style.position = "absolute";
    img.style.width = "135px";  // 根据实际图片尺寸调整
    img.style.height = "auto";
    img.style.bottom = "32%";   // 微调位置
    img.style.left = "50%";
    img.style.transform = "translateX(-50%)";  // 水平居中
    img.style.objectFit = "contain";
    
    // 添加ID便于后续操作
    img.id = "label-image";
    displayElement.appendChild(img);


    // 1000毫秒后隐藏刺激
    /*setTimeout(function() {
      var elements = displayElement.querySelectorAll("*");
      elements.forEach(function(el) {
        el.style.display = 'none';
      });
    }, 100000);*/
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_choice);
    console.log('current coherence ', data.target_color_proportion)
  },
};

//练习阶段每个试次的反馈

var feedbackTrial = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 500,
  stimulus: function () {
    // this function will check the accuracy of the last response and use that information to set
    // the stimulus value on each trial.
    var trial_data = jsPsych.data.get().last(1).values()[0];
    var correct = trial_data.correct;
    var rt = trial_data.rt
    if (rt > 0 && rt < 250) {
      return `<p style='font-size: 60px; color: yellow'>太快!</p>`;
    } else if (rt == -1) {
      return `<p style='font-size: 60px; color: yellow'>太慢!</p>`;
    } else if (correct) {
      return `<p style='font-size: 60px; color: green'>正确!</p>`;
    } else {
      return `<p style='font-size: 60px; color: red'>错误!</p>`;
    }
  },
};

//计算整个练习阶段的总体正确率
//计算32个试次的反应数，挑出正确的试次数，计算准确率 
//如果整体正确率未达到70%以及上，则让被试继续练习

var instruction_continuePractice = {
  type: jsPsychHtmlKeyboardResponse,
  stimuls: "",
  on_start: function () {
    //document.body.style.backgroundColor = "black";
    if (userId % 2 === 0) {
      this.stimulus = `
        <div style="text-align: left; color: white; padding: 10px">  
          <p>您的正确率未达到进入下一阶段的要求</p >
          <p >您的任务是：判断散点图的整体颜色与文字标签是否匹配 。整体为红色代表你自己；整体为蓝色代表他人。</p>
          <p >如果二者<span style="color: hsl(135, 50%, 50%)">匹配</span>，请按 <span style="color: hsl(135, 50%, 50%)">"F" 键</span></p>
          <p >如果二者<span style="color: red">不匹配</span>，请按 <span style="color: red">"J" 键</span></p>
          <p>请按 "Q" 键继续练习</p >
        </div>`;
    } else {
      this.stimulus = `
        <div style="text-align: left; color: white; padding: 10px">  
          <p>您的正确率未达到进入下一阶段的要求</p >
          <p >您的任务是：判断散点图的运动方向与文字标签是否匹配 。整体为蓝色代表你自己；整体为红色代表他人。</p>
          <p >如果二者<span style="color: hsl(135, 50%, 50%)">匹配</span>，请按 <span style="color: hsl(135, 50%, 50%)">"F" 键</span></p>
          <p >如果二者<span style="color: red">不匹配</span>，请按 <span style="color: red">"J" 键</span></p>
          <p>请按 "Q" 键继续练习</p >
        </div>`;
    }
  },
  response_ends_trial: true,
  choices: "q",
  data: {
    part: "instruction_continuePractice",
  }
};

//如果达到70%及以上，则结束练习
var instruction_practiceEnd = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="text-align: center; color: white; padding: 30px; font-size: 30px">
      <p>恭喜您完成练习，请按空格键进入正式任务。</p >
      <p> 正式任务仅在每组 测试结束后提供反馈</p>
    </div>
    `,
  response_ends_trial: true,
  choices: " ",
  on_finish: function () {
    document.body.style.backgroundColor = "black";
  },
  data: {
    part: "instruction_practiceEnd"
  },
};

//if_practiceAgain 用于判断是否呈现 feedback_continuePractice

var if_practiceAgain = {
  timeline: [instruction_continuePractice],
  conditional_function: function () { //这里需要重新计算一次？
    var trials = jsPsych.data.get().filter({ task: 'response' }).last(32)
    var correct_trials = trials.filter({ correct: true });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    console.log({ accuracy: accuracy});
    if (accuracy >= window.pract_pass_rate) {
      return false;//达标就skip掉instruction_continuePractice这一段
    } else if (accuracy < window.pract_pass_rate) { //没达标呈现instruction_continuePractice
      return true;
    }
  }
};

//if_endPractice 用于判断是否呈现 instruction_practiceEnd

var if_endPractice = {
  timeline: [instruction_practiceEnd],
  conditional_function: function () {
    var trials = jsPsych.data.get().filter({ task: 'response' }).last(32)
    var correct_trials = trials.filter({ correct: true });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    console.log({ accuracy: accuracy});
    if (accuracy >= window.pract_pass_rate) {
      return true;//达标呈现 instruction_practiceEnd
    } else if (accuracy < window.pract_pass_rate) {
      return false;
    }
  }
};

//这里是练习

var practice_block_selfRed = {
  timeline: [
    instruction_match_practice,
    {
      timeline: [fixation, match_RDK, feedbackTrial],
      timeline_variables: conditions_match_selfRed,
      repetitions: 2,
      randomize_order: true
    },
    if_practiceAgain,
    if_endPractice,
  ],
  loop_function: function () {
    var data = jsPsych.data.get().last(1).values()[0];
    if (jsPsych.pluginAPI.compareKeys(data.response, "q")) {
      return true;
    } else {
      return false;
    }
  },
};

var practice_block_selfBlue = {
  timeline: [
    instruction_match_practice,
    {
      timeline: [fixation, match_RDK, feedbackTrial],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 2,
      randomize_order: true
    },
    if_practiceAgain,
    if_endPractice,
  ],
  loop_function: function () {
    var data = jsPsych.data.get().last(1).values()[0];
    if (jsPsych.pluginAPI.compareKeys(data.response, "q")) {
      return true;
    } else {
      return false;
    }
  },
};

var practice_selfRed = {
  timeline: [practice_block_selfRed],
  conditional_function: function () {
    if (userId % 2 === 0) {
      console.log("match_selfRed");
      return true;
    } else {
      return false;
    }
  }
};

var practice_selfBlue = {
  timeline: [practice_block_selfBlue],
  conditional_function: function () {
    if (userId % 2 !== 0) {
      console.log("match_selfBlue");
      return true;
    } else {
      return false;
    }
  }
};

var practice_match = {
  timeline: [practice_selfRed, practice_selfBlue]
};

color.timeline.push(practice_match);

//这里是正式

var instruction_match_formal = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="text-align: center; color: white; padding: 35px; font-size: 35px">
      <p>请按下空格键开始【正式任务】</p >
    </div>
    `,
  response_ends_trial: true,
  choices: " ",
  on_finish: function () {
    document.body.style.backgroundColor = "black";
  },
  data: {
    part: "instruction_match_formal"
  }
};

var rest_match = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    // 根据 currentBlock 生成提示信息
    return `
      <div style="text-align: center; color: white; padding: 35px; font-size: 35px">
        <p>恭喜您，已完成 ${currentBlock}/8</p>
        <p>请休息一下，若准备好可按空格键继续</p>
      </div>
    `;
  },
  response_ends_trial: true,
  choices: " ",
  on_start: function() {
    currentBlock += 1
  },
  on_finish: function () {
    document.body.style.backgroundColor = "black";
  },
  data: {
    part: "instruction_rest"
  }
};

var rest_rdk = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    // 根据 currentBlock 生成提示信息
    return `
      <div style="text-align: center; color: white; padding: 35px; font-size: 35px">
        <p>恭喜您，已完成 ${currentBlock}/4</p>
        <p>请休息一下，若准备好可按空格键继续</p>
      </div>
    `;
  },
  response_ends_trial: true,
  choices: " ",
  on_start: function() {
    currentBlock += 1
  },
  on_finish: function () {
    document.body.style.backgroundColor = "black";
  },
  data: {
    part: "instruction_rest"
  }
};

//设置反馈 block 的反馈

var feedbackBlock_match = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 3000,
  stimulus: function () {
    var trials = jsPsych.data.get().filter({ task: 'response' }).last(48)
    var correct_trials = trials.filter({ correct: true });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(trials.select('rt').mean());
    console.log({ accuracy: accuracy, rt: rt });
    return `<p style='font-size: 35px; color: white'>本组测试中，您的正确率为： ${accuracy}% ，平均反应时为：${rt}毫秒。</p>`; 
  }
};

var formal_block_selfRed = {
  timeline: [
    instruction_match_formal,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfRed,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
  ],
};

var formal_block_selfBlue = {
  timeline: [
    instruction_match_formal,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
    {
      timeline: [fixation, match_RDK],
      timeline_variables: conditions_match_selfBlue,
      repetitions: 3,
      randomize_order: true
    },
    feedbackBlock_match,
    rest_match,
  ],
};


var formal_selfRed = {
  timeline: [formal_block_selfRed],
  conditional_function: function () {
    if (userId % 2 === 0) {
      return true;
    } else {
      return false;
    }
  }
};

var formal_selfBlue = {
  timeline: [formal_block_selfBlue],
  conditional_function: function () {
    if (userId % 2 !== 0) {
      return true;
    } else {
      return false;
    }
  }
};

var formal_match = {
  timeline: [formal_selfRed, formal_selfBlue]
};

color.timeline.push(formal_match);

/*----------匹配任务结束！下面是RDK颜色判断任务-----------*/

//指导语(包含开始，练习和结束)

var instruction_RDK_beginning = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
      <div style="text-align: left; color: white; padding: 10px"> 
        <h3 style="text-align: center; font-size: 30px; margin: 10px">任务二：整体颜色判断</h3>
        <p>接下来，屏幕上会呈现一些运动的圆点，其中一定比例的点为 <span style="color: hsl(0, 50%, 50%)">红色</span> ，其余为 <span style="color: hsl(225, 50%, 50%)">蓝色</span>，</p>
        <p>您需要在3秒内判断 <span style="font-weight: bold">散点图的整体颜色（即大多数点的颜色）是红色还是蓝色 </span>：</p >
        <ul>
          <li>整体为 <span style="color: hsl(0, 50%, 50%)">红色</span>，请按键盘 <span style="color: hsl(0, 50%, 50%)">"D" 键</span></li>
          <li>整体为 <span style="color: hsl(225, 50%, 50%)">蓝色</span>，请按键盘 <span style="color: hsl(225, 50%, 50%)">"k" 键</span> </li>
        </ul>
        <p>请按下空格键进入练习阶段</p>
      </div>`,
  response_ends_trial: true,
  choices: " ",
  data: {
    part: "instruction_RDK_beginning",
  }
};

//color.timeline.push(instruction_RDK_beginning);

//下面这些指导语会在后面 push

var instruction_RDK_practice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="text-align: center; color: white; padding: 35px; font-size: 30px">
      <p>请把左手食指放在键盘 <span style="color: hsl(0, 50%, 50%)">"D"键</span> 上，右手食指放在 <span style="color: hsl(225, 50%, 50%)">"K"键</span> 上</p >
      <p>请按下空格键进入【练习阶段】</p >
    </div>
    `,
  response_ends_trial: true,
  choices: " ",
  on_start: function() {
    currentBlock = 1
  },
  on_finish: function () {
    document.body.style.backgroundColor = "black";
  },
  data: {
    part: "instruction_RDK_practice"
  }
};

var instruction_RDK_practice_end = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="text-align: center; color: white; padding: 30px; font-size: 30px">
      <p>练习结束！</p >
      <p>继续练习请按 "Q" 键 </p>
      <p>进入正式实验请按空格键, 正式实验仅在 每组 测试结束后提供反馈</p>
    </div>
    `,
  response_ends_trial: true,
  choices: ["q", " "],
  on_finish: function () {
    document.body.style.backgroundColor = "black";
  },
  data: {
    part: "instruction_RDK_practice_end"
  },
};

var instruction_RDK_formal_beginning = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="text-align: center; color: white; padding: 35px; font-size: 30px">
      <p>请把左手食指放在键盘 <span style="color: hsl(0, 50%, 50%)">"D"键</span> 上，右手食指放在 <span style="color: hsl(225, 50%, 50%)">"K"键</span> 上</p >
      <p>请按下空格键开始【正式实验】</p >
    </div>
    `,
  response_ends_trial: true,
  choices: " ",
  on_finish: function () {
    document.body.style.backgroundColor = "black";
  },
  data: {
    part: "instruction_RDk_formal_beginning"
  }
};


// 整体颜色判断任务

//整体颜色判断任务的不同条件

let conditions_RDK_selfRed = [
  { target_color_proportion: 0.51, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 4, association: "self" },
  { target_color_proportion: 0.51, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 4, association: "other" },
  { target_color_proportion: 0.54, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 3, association: "self" },
  { target_color_proportion: 0.54, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 3, association: "other" },
  { target_color_proportion: 0.59, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 2, association: "self" },
  { target_color_proportion: 0.59, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 2, association: "other" },
  { target_color_proportion: 0.64, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 1, association: "self" },
  { target_color_proportion: 0.64, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 1, association: "other" },
];

let conditions_RDK_selfBlue = [
  { target_color_proportion: 0.51, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 4, association: "other" },
  { target_color_proportion: 0.51, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 4, association: "self" },
  { target_color_proportion: 0.54, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 3, association: "other" },
  { target_color_proportion: 0.54, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 3, association: "self" },
  { target_color_proportion: 0.59, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 2, association: "other" },
  { target_color_proportion: 0.59, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 2, association: "self" },
  { target_color_proportion: 0.64, dot_color_final: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"], correct_choice: "d", difficulty: 1, association: "other" },
  { target_color_proportion: 0.64, dot_color_final: ["hsl(225, 50%, 50%)", "hsl(0, 50%, 50%)"], correct_choice: "k", difficulty: 1, association: "self" },
];

//主要呈现的刺激

var RDK = {
  type: jsPsychRdk,
  number_of_apertures: 1,
  number_of_dots: 100,
  //post_trial_gap: 500,
  dot_color: ["hsl(0, 50%, 50%)", "hsl(225, 50%, 50%)"],
  dot_color_final: function () { return jsPsych.timelineVariable("dot_color_final") },
  target_color_proportion: function () { return jsPsych.timelineVariable("target_color_proportion") },
  color_change_delay: 0.5,
  choices: ["d", "k"],
  correct_choice: function () { return jsPsych.timelineVariable("correct_choice") },
  coherent_direction: 0,
  coherence: 0,
  dot_radius: 3, 
  move_distance: 2, 
  aperture_width: 300,
  aperture_height: 300,
  aperture_center_x: 960,
  background_color: "black",
  trial_duration: 3000,
  data: {
    part: "RDK",
    task: "response",
    correct_response: function () { return jsPsych.timelineVariable("correct_choice") },
    difficulty: function () { return jsPsych.timelineVariable("difficulty") },
    association: function () { return jsPsych.timelineVariable("association") },
  },
  on_start: function() {
    //替换proportion的值
    updateProportion(conditions_RDK_selfBlue)
    updateProportion(conditions_RDK_selfRed)

    var displayElement = jsPsych.getDisplayElement();
    //1000毫秒后隐藏刺激
    setTimeout(function() {
      var elements = displayElement.querySelectorAll("*");
      elements.forEach(function(el) {
        el.style.display = 'none';
      });
    }, 1000);
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    //重新显示元素
    var displayElement = jsPsych.getDisplayElement();
    var elements = displayElement.querySelectorAll("*");
    elements.forEach(function(el) {
      el.style.display = 'inline';
    });
  },
};

//练习阶段的任务

var practice_block_RDK_selfRed = {
  timeline: [
    instruction_RDK_beginning,
    instruction_RDK_practice,
    {
      timeline: [fixation, RDK, feedbackTrial],
      timeline_variables: conditions_RDK_selfRed,
      repetitions: 2,
      randomize_order: true
    },
    instruction_RDK_practice_end
  ],
  loop_function: function () {
    var data = jsPsych.data.get().last(1).values()[0];
    if (jsPsych.pluginAPI.compareKeys(data.response, "q")) {
      return true;
    } else {
      return false;
    }
  },
};

var practice_block_RDK_selfBlue = {
  timeline: [
    instruction_RDK_beginning,
    instruction_RDK_practice,
    {
      timeline: [fixation, RDK, feedbackTrial],
      timeline_variables: conditions_RDK_selfBlue,
      repetitions: 2,
      randomize_order: true
    },
    instruction_RDK_practice_end
  ],
  loop_function: function () {
    var data = jsPsych.data.get().last(1).values()[0];
    if (jsPsych.pluginAPI.compareKeys(data.response, "q")) {
      return true;
    } else {
      return false;
    }
  },
};

var practice_RDK_selfRed = {
  timeline: [practice_block_RDK_selfRed],
  conditional_function: function () {
    if (userId % 2 === 0) {
      console.log("practice_selfRed");
      return true;
    } else {
      return false;
    }
  }
};

var practice_RDK_selfBlue = {
  timeline: [practice_block_RDK_selfBlue],
  conditional_function: function () {
    if (userId % 2 !== 0) {
      console.log("practice_selfBlue");
      return true;
    } else {
      return false;
    }
  }
};


var practice_block_RDK = {
  timeline: [practice_RDK_selfRed, practice_RDK_selfBlue]
};

color.timeline.push(practice_block_RDK);

//正式阶段的任务

//设置反馈

var feedbackBlock_RDK = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 3000,
  stimulus: function() {
    var trials = jsPsych.data.get().filter({task: 'response'}).last(48)
    var correct_trials = trials.filter({correct: true});
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(trials.select('rt').mean());
    console.log({ accuracy: accuracy, rt: rt });
    return `<p style='font-size: 35px; color: white'>本组测试中，您的正确率为： ${accuracy}% ，平均反应时为：${rt}毫秒。</p>`;   
  }
};

var formal_block_RDK_selfRed = {
  timeline: [
    instruction_RDK_formal_beginning,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfRed,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
    rest_rdk,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfRed,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
    rest_rdk,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfRed,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
    rest_rdk,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfRed,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
  ],
};

var formal_block_RDK_selfBlue = {
  timeline: [
    instruction_RDK_formal_beginning,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfBlue,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
    rest_rdk,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfBlue,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
    rest_rdk,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfBlue,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
    rest_rdk,
    {
      timeline: [fixation, RDK],
      timeline_variables: conditions_RDK_selfBlue,
      repetitions: 6,
      randomize_order: true
    },
    feedbackBlock_RDK,
  ],
};

var formal_RDK_selfRed = {
  timeline: [formal_block_RDK_selfRed],
  conditional_function: function () {
    if (userId % 2 === 0) {
      console.log("formal_selfRed");
      return true;
    } else {
      return false;
    }
  }
};

var formal_RDK_selfBlue = {
  timeline: [formal_block_RDK_selfBlue],
  conditional_function: function () {
    if (userId % 2 !== 0) {
      console.log("formal_selfBlue");
      return true;
    } else {
      return false;
    }
  }
};


var formal_block_RDK = {
  timeline: [formal_RDK_selfRed, formal_RDK_selfBlue]
};

color.timeline.push(formal_block_RDK);

// over