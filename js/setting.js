var biData = {
    data:{
        value: "bi标签",	//初始值
        style: {	//标签显示的样式
            color: "#b00",
            "font-size": "14px",
        },
        userdata: "bi-canvansimg",
    },

    on: false,	//是否开启
}

function switchCanvasBg(index){
   let dCanvas = document.getElementsByClassName("dCanvas selected")[0];
   if(index==0){
      dCanvas.classList.remove("default");
      dCanvas.classList.add("light");
   }else{
      dCanvas.classList.remove("light");
      dCanvas.classList.add("default");
   }
}
function switchCanvasRate(index)
{
    let canvasBox = document.getElementsByClassName("canvas_box_main")[0]; 
    let dCanvas = document.getElementsByClassName("dCanvas selected")[0];
    switch(index){
        case 1:
            dCanvas.style.width =  (canvasBox.clientWidth-90) + "px";
            dCanvas.style.height = (canvasBox.clientHeight-85) + "px";
            break;
        case 2:
            dCanvas.style.height = ((canvasBox.clientWidth-90) * 9 )/16 +"px";
            dCanvas.style.width = (canvasBox.clientWidth-90) + "px";
          
            break;
        case 3:
            dCanvas.style.width = ((canvasBox.clientHeight-85) * 9 )/16 +"px";
            dCanvas.style.height =  (canvasBox.clientHeight-85) +"px" ;
            break;
    }
    dCanvas.style.left = "50%";
    dCanvas.style.top = "50%";
    dCanvas.style.transform = "translate(-50%,-50%)";

}

function startBg(event){
    var self=this;
    self.biData.userdata="isImage";
    var checked=$('#blackimg').attr('class');
    if(checked=='icon_checked'){
        self.biData.value=true;
        $('#blackimg').attr("class", "icon_checked checked");
        $('.setup_bg').removeClass('hide');
        e.getCurCanvas().getElementsByClassName('d-image')[0].style.display = "block";
    }else if(checked=='icon_checked checked'){
        self.biData.value=false;
        $('#blackimg').attr("class", "icon_checked");
        $('.setup_bg').addClass('hide');
        e.getCurCanvas().getElementsByClassName('d-image')[0].style.display = "none";
    }
}
function showSettingBgPop(){
    $('#pop-windows-for-type').css('display','table')
}
function hideSettingBgPop(){
    $('#pop-windows-for-type').css('display','none')
}
