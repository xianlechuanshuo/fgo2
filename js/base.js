﻿//localStorage只能存储字符串，如果需要存储对象，首先要转化为字符串。利用JSON.stringify()；
var storage = window.localStorage;
try{
    storage.removeItem("test");
    storage.setItem("test",1);
    storage.getItem("test")); 
    
}
catch(e){
    alert("不支持localStorage");       
}
//IOS safari浏览器无痕模式下localStorage不起作用，我们需要做判断，存在问题则提示
if (typeof storage === 'object') {
    try {
        storage.removeItem('localStorage');
        storage.setItem('localStorage', 1);
        storage.removeItem('localStorage');
    } catch (e) {
        alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
    }
}


//显示从者技能详情
$("btnShowSkills").onclick = function () {
    showSkillsWin();
}

$("btnShowMaterials").onclick=function(){
    showMaterialsWin();
}

$("btnShowNP").onclick=function(){
    showNPWin();
}

//关闭从者技能详情
$("btnClose").onclick = function () {
    hideSkillsWin();
}

//查询
$("txtWord").oninput = function () {
    search();
}
$("btnSearch").onclick = function () {
    search();
}

//双击下载图片
$("showSkillsWin").ondblclick =function(){
    var url= document.querySelector(".skillImg").src;
    downloadFile(url);
}

//显示查询结果
function showResult() {
    showDiv("divResult");
}
//隐藏查询结果
function hidResult() {
    hideDiv("divResult");
}

function showWin(type,ext){
    var id = $("ddlChooseServant").value;
    if (id == "-1") {
        alert("请选择从者");
        return;
    }
    showDiv("showSkillsWin");
    var servant = servants[id];
    var eName = filterStr(servant.eName);
    document.querySelector(".skillImg").src="images/"+type+"/"+eName+ext;
}

//显示技能图
function showSkillsWin() {
    showWin("Skill",".png")

}
//隐藏技能图
function hideSkillsWin() {
    hideDiv("showSkillsWin");
}
//显示强化素材图
function showMaterialsWin(){
    showWin("Material",".jpg");
}

//显示NP获取TOP5图
function showNPWin(){
    showWin("NP",".png");
}


//查询
function search() {
    //清空从者数据数组
    servants.length = 0;
    //重置计数器
    id = 0;

    //重新初始化从者数据数组
    intialData();


    //过滤关键词特殊字符
    word = filterStr2($("txtWord").value);

    //根据关键词查询匹配结果
    if(word[0]=="$"){
        word=word.substr(1);
        servants = servants.filter(containsAttribute);
    }
    else if(word[0]=="#"){
        word=word.substr(1);
        servants = servants.filter(containsCharacteristics);
    }
    else if(word[0]=="@"){
        word=word.substr(1);
        servants = servants.filter(containsCamp);    
    }
    else{
        servants = servants.filter(contains);
    }

    
    
    //更新数组序号
    var tmpServants = [];
    for (var i = 0; i < servants.length; i++) {
        tmpServants[servants[i].id] = servants[i];
    }
    servants = tmpServants;

    $("ddlChooseServant").length = 0;
    if (word == "") {
        $("ddlChooseServant").options.add(new Option("|----------------------请选择从者-------------------------|", -1));
    }
    intialServantList();
    $("ddlChooseServant").onchange();
}

//点击属性和特性超链接字体
function autoClickSearch(obj){
    $("txtWord").value=obj.dataset.value;
    $("btnSearch").click();
}

//根据关键词查询结果
var word = "";
function contains(servant) {
    return servant.keys.find(check);
}
function containsAttribute(servant) {
    return servant.attributes.find(check);
}
function containsCharacteristics(servant) {
    return servant.characteristics.find(check);
}
function containsCamp(servant){
    return servant.camp==word;
}

function check(key) {
    if (word == "") {
        return true;
    }
    return new RegExp(word, "gi").test(key);//忽略大小写
}


//跳转到茹西教王的理想鄉
$("btnRedirectKazemai").onclick = function () {
    redirectLink('https://kazemai.github.io/fgo-vz/svtData.html?no=');
}
//跳转到wiki
$("btnRedirectWiki").onclick = function () {
    redirectLink('http://fgowiki.com/guide/petdetail/');
}
//跳转页面
function redirectLink(link) {
    var id = $("ddlChooseServant").value;
    if (id != "-1" && id != "") {
        //window.top.location = link + servants[id].servantNo;
        openTab(link + servants[id].servantNo);
    }
    else {
        alert("请选择从者");
    }
}
//设置本地存储信息
function setStorage() {
    if (storage) {
        //另外，在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误，这时一般在setItem之前，先removeItem()就ok了。
        storage.removeItem("ddlChooseServant");
        storage.setItem("ddlChooseServant", $("ddlChooseServant").value);

        //清除缓存
        storage.removeItem("servants");
    }
}
//加载本地存储信息
//360浏览器不支持es6中的函数参数默认值
function loadStorage(isTreasure) {
    $("ckIsMaxGrail").checked=false;
    if (storage) {
        var id = storage.getItem("ddlChooseServant");
        if (id!=null&&id != "" && id != "-1") {
            $("ddlChooseServant").value = id;
            if (isTreasure) {
                changeOc();
            }
            bindServantData(id);
        }
    }
}

//绑定属性和特性值
function binds(servant,key,id,flag){
    var attributes = servant[key].clone();//数组复制，不影响原数组
    if (attributes instanceof Array && attributes.length > 0) {
        for (var i = 0; i < attributes.length; i++) {
            attributes[i]= "<a href=\"javascript:;\" data-value=\""+flag+attributes[i]+"\" onclick=\"autoClickSearch(this)\">"+attributes[i]+"</a>";
        }

        attributes = attributes.join("&nbsp;&nbsp;&nbsp;&nbsp;");
        $(id).innerHTML = attributes;
    }
}

//属性
function bindAttributes(servant) {
    binds(servant,"attributes","spanAttributes","$");
}
//特性  
function bindCharacteristics(servant) {
    binds(servant,"characteristics","spanCharacteristics","#");
}
//加载搜索提示(类似自动完成)
function bindSearchTips(){
    var tips=[],
        tmpCamp,
        tmpAttributes,
        tmpCharacteristics;
    servants.forEach(function(servant){
        tmpCamp=servant.camp;
        tmpAttributes=servant.attributes.clone();
        tmpCharacteristics=servant.characteristics.clone();

        tips.push("@"+tmpCamp);

        tmpAttributes.forEach(function(a){
            tips.push("$"+a);
        });
    tmpCharacteristics.forEach(function(c){
            tips.push("#"+c);

        });
    })
    //去重
    tips=tips.uniq();
    //加载属性和特性的搜索提示(类似自动完成)
    var dlTips=$("dlTips");
    tips.forEach(function(t){
        var opt=document.createElement("option");
        opt.value=t;
        dlTips.appendChild(opt);
    })
    
    var dlCardTips=$("dlCardTips");
    var cardTipStr='<option value="786">20级宝石翁</option>';
    cardTipStr+='<option value="1089">40级宝石翁</option>'
    cardTipStr+='<option value="2000">100级宝石翁</option>'
    cardTipStr+='<option value="332">20级虚数</option>'
    cardTipStr+='<option value="471">40级虚数</option>'
    cardTipStr+='<option value="750">80级虚数</option>'
    cardTipStr+='<option value="943">20级黑杯</option>'
    cardTipStr+='<option value="1307">40级黑杯</option>'
    cardTipStr+='<option value="2400">100级黑杯</option>'
    cardTipStr+='<option value="393">20级魔性菩薩</option>'
    dlCardTips.innerHTML=cardTipStr;   
}

