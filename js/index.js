//=========================================================================================================================
window.onload = function () {
    e.createDashboard();
    e.initUI();
    e.initEvent();
}
var o = {
    dashboard: {
        id: 0,
        name: ''
    },
    arrCanvasIds: [],
    curCanvasId: 0,
    setPanels: {
        //   id:dom对象
    },
    textPanels: {
        //   id:dom对象
    },
    curTextPanelId:0,
    siderData: {
        min: 0, //最大最小值
        max: 100,
        digits: 0,		//小数位数,
        isDrag:false
        
    },
    getCurCanvasId: function () {
        return this.curCanvasId;
    },
    setCurCanvasId: function (id) {
        this.curCanvasId = id;
    },
    getCurCanvasIndex: function () {
        return contains(this.arrCanvasIds, this.curCanvasId);
    },
    getNextCanvasId: function () {
        let index = this.getCurCanvasIndex();
        if (index == this.arrCanvasIds.length - 1) {
            return false;
        }
        return this.arrCanvasIds[index + 1];

    },
    getBeforeCanvasId: function () {
        let index = this.getCurCanvasIndex();
        if (index == 0) {
            return false;
        }
        return this.arrCanvasIds[index - 1];
    },
}

var e = {
    createDashboard: function () {
        var dashboardId = "dashboard-id-" + getCurTime();
        o.dashboard.id = dashboardId;
        return dashboardId;
    },
    setDashboardName: function () {
        var dashboardName = o.dashboard.name;
        if (dashboardName == '') {
            $('.small-tip').html('仪表盘名称不能为空').fadeIn().delay(1000).fadeOut();
            return;
        } else {
            $('.small-tip').html('保存成功').fadeIn().delay(1000).fadeOut();
        }
        o.dashboard.name = name;
    },
    saveDashboard: function () {
        // http请求
        // name 、id 、 画布信息等
    },
    initUI: function () {
        this.createCanvas(); // 创建主画布
        this.initToolCharts(); // 图表列表
    },
    initEvent: function () {
        $('.add_canvas').click(function () {
            e.createCanvas();
        });

        $('.btn-save').click(function () {
            e.setDashboardName();
        });
        $('#dashboard-name').on('input', function () {
            o.dashboard.name = this.value;
        });

        $('.btn-preview-btn').click(function () {
            let curCanvas = e.getCurCanvas();
            $('#preview-box').append(curCanvas);
            $('#preview-panel').css('display', "block");
            e.createPreviewSlide();
        });

        $('.ng_closeBtn').click(function () {
            let curCanvas = e.getCurCanvas();
            $('.canvas_box_main').append(curCanvas);
            $('#preview-panel').css('display', "none");
            e.initSlidePanel();
        });

        $('.btn-export-xlsx').click(function () {
            $('.small-tip').html('暂未开放').fadeIn().delay(1000).fadeOut();
        });

        $('.btn-export-img').click(function () {
            let curCanvas = e.getCurCanvas();
            html2canvas(curCanvas, {}).then(canvas => {
                var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url  
                var saveLink = document.createElement('a');
                saveLink.href = imgUri;
                saveLink.download = 'img.png';
                saveLink.click();
            });
        });

        $('.btn-export-pdf').click(function () {
            let curCanvas = e.getCurCanvas();
            html2canvas(curCanvas, {
                dpi: 172, //导出pdf清晰度
                onrendered: function (canvas) {
                    var contentWidth = canvas.width;
                    var contentHeight = canvas.height;

                    //一页pdf显示html页面生成的canvas高度;
                    var pageHeight = contentWidth / 592.28 * 841.89;
                    //未生成pdf的html页面高度
                    var leftHeight = contentHeight;
                    //页面偏移
                    var position = 0;
                    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                    var imgWidth = 595.28;
                    var imgHeight = 592.28 / contentWidth * contentHeight;

                    var pageData = canvas.toDataURL('image/jpeg', 1.0);

                    var pdf = new jsPDF('', 'pt', 'a4');

                    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                    //当内容未超过pdf一页显示的范围，无需分页
                    if (leftHeight < pageHeight) {
                        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                    } else {
                        while (leftHeight > 0) {
                            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                            leftHeight -= pageHeight;
                            position -= 841.89;
                            //避免添加空白页
                            if (leftHeight > 0) {
                                pdf.addPage();
                            }
                        }
                    }

                    pdf.save("content.pdf");
                }
            })
        });
        $('.btn-push').click(function () {
            $('.small-tip').html('暂未开放').fadeIn().delay(1000).fadeOut();
        });

        $('.preview_btn .left_btn').click(function () {
            if ($('.layer_canvas_box ul li.active').attr('index') == 0) return;

            var curLi = $('.layer_canvas_box ul li.active');
            curLi.removeClass('active');
            curLi.prev().addClass('active');
            $('#dashboard_preview_title').text("未命名" + (parseInt($('.layer_canvas_box ul li.active').attr('index')) + 1));

            e.getCurCanvas().style.display = "none";
            $('.canvas_box_main').append(e.getCurCanvas());
            o.setCurCanvasId(o.getBeforeCanvasId());
            e.getCurCanvas().style.display = "block";
            $('#preview-box').append(e.getCurCanvas());
        });
        $('.preview_btn .right_btn').click(function () {
            if ($('.layer_canvas_box ul li.active').attr('index') == (o.arrCanvasIds.length - 1)) return;

            var curLi = $('.layer_canvas_box ul li.active');
            curLi.removeClass('active');
            curLi.next().addClass('active');
            $('#dashboard_preview_title').text("未命名" + (parseInt($('.layer_canvas_box ul li.active').attr('index')) + 1));

            e.getCurCanvas().style.display = "none";
            $('.canvas_box_main').append(e.getCurCanvas());
            o.setCurCanvasId(o.getNextCanvasId());
            e.getCurCanvas().style.display = "block";
            $('#preview-box').append(e.getCurCanvas());
        });

        $('.canvasbg .fc_tab ul li').click(function () {
            $(this).addClass("active").siblings().removeClass("active");
            var curA = $(this).find('a').attr('href');
            $(curA).addClass('active').siblings().removeClass("active");
        });
        $('.tab-pane .canvasbg_list .canvasbg_box .cb_bg').click(function () {
            $("#bottomimg").attr('src', $(this).attr('data'));
            e.getCurCanvas().getElementsByClassName('d-image')[0].src = $(this).attr('data');
            e.getCurCanvas().getElementsByClassName('d-image')[0].style.display = "block";
            $('#pop-windows-for-type').css('display', 'none');
        });
    
        // 文本设置start

        // 加粗/斜体/下划线
        $('.bi-check-list-ico-div a').click(function () {
            $(this).toggleClass('active');
            e.updateTextPanel(o.curTextPanelId);
        });

        $(".bi-input-number-range-input").change(function(event){
            if(event.target.value<0) event.target.value =0;

            if(event.target.id == "text-opacity-input" && event.target.value>1 ){
                event.target.value =1;
            }
            if(event.target.id == "text-font-size" && event.target.value<12){
                event.target.value =12;
            }

            e.updateTextPanel(o.curTextPanelId);
        });

        $('.bi-select-text-select').change(function(){
            e.updateTextPanel(o.curTextPanelId);
        });
        $('.bi-input-number-range-retouv2').mousedown(function (event) {

            var tx =  event.x;
            if (typeof (tx) == "undefined") {
                tx = event.clientX;
            }
            if (event && event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            e.resetPoint(tx,this);
            o.siderData.isDrag = true;
        });
        $('.bi-input-number-range-retouv2').mousemove(function(event){
            var ttooltip = $(this).find(".bi-input-number-range-tooltip");
            ttooltip.addClass("in");
            if(!o.siderData.isDrag) return;
            var tx =  event.x;
            if (typeof (tx) == "undefined") {
                tx = event.clientX;
            }
            if (event && event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            e.resetPoint(tx,this);
        });
        $('.bi-input-number-range-retouv2').mouseup(function(event){
             //数值提示框
            var ttooltip = $(this).find(".bi-input-number-range-tooltip");
            ttooltip.removeClass("in");
            o.siderData.isDrag = false;
            e.updateTextPanel(o.curTextPanelId);
        });
        $('.bi-input-number-range-retouv2').mouseout(function(event){
            //数值提示框
           var ttooltip = $(this).find(".bi-input-number-range-tooltip");
           ttooltip.removeClass("in");
           o.siderData.isDrag = false;
           e.updateTextPanel(o.curTextPanelId);
       });
       $('.bi-color-edit-div').ColorPicker({
        color: '#0000ff',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('#colorSelector div').css('backgroundColor', '#' + hex);
        },
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).css('backgroundColor', '#' + hex);
            e.updateTextPanel(o.curTextPanelId);
        },
    });
    },
    resetPoint: function (vx,target) {
        if(target.id == "text-opacity-slider"){
            o.siderData.max = 1;
            o.siderData.min = 0;
            o.siderData.digits = 2;
        }else if(target.id == "text-size-slider"){
            o.siderData.max = 100;
            o.siderData.min = 12;
            o.siderData.digits = 0;
        }
        else{
            o.siderData.max = 100;
            o.siderData.min = 0;
            o.siderData.digits = 0;
        }

        //滑块
        var tparent = $(target).find(".bi-input-number-range-slider-track");
        //数值提示框
        var ttooltip = $(target).find(".bi-input-number-range-tooltip");
        ttooltip.addClass("in");

        //计算鼠标位于滑条的位置，超出范围做规范
        var mainOffset = tparent.offset();
        var mainWidth = tparent.width();
        var tpointX = vx - mainOffset.left;
        if (tpointX < 0) {
            tpointX = 0;
        }
        if (tpointX > mainWidth) {
            tpointX = mainWidth;
        }

        //根据滑块位置计算出对应的数值
        var tvalue = o.siderData.min + (o.siderData.max - o.siderData.min) * tpointX / mainWidth;
        //根据数值调整界面显示和数据
        e.resetPointForValue(tvalue,target);
    },
    resetPointForValue: function (vvalue,target) {
        vvalue = vvalue * 1;
        if (!o.siderData.digits) {
            o.siderData.digits = 0;
        }
        if (typeof (vvalue) == "number") {
            vvalue = vvalue.toFixed(o.siderData.digits);
        } else {
            console.log("范围数据调整组件：值不是数值类型的。");
        }

        //做数值规范化，限制在min-max之间
        var tvalue = vvalue;
        if (tvalue < o.siderData.min) {
            tvalue = o.siderData.min;
        }
        if (tvalue > o.siderData.max) {
            tvalue = o.siderData.max;
        }
        //保留值，鼠标抬起时修改输入框
        $(target).next().find('input').val(tvalue);

        //滑块
        var tparent = $(target).find(".bi-input-number-range-slider-track");
        //滑块条，右半部分
        var tselection = $(target).find(".bi-input-number-range-slider-selection");
        //滑块圆形
        var thandle = $(target).find(".bi-input-number-range-slider-handle");
        //数值提示框
        var ttooltip = $(target).find(".bi-input-number-range-tooltip");
        //数值tips显示
        var ttooltiptxt = $(target).find(".bi-input-number-range-tooltip-inner");
        ttooltiptxt = $(ttooltiptxt);
        ttooltiptxt.html("" + tvalue);	//修改显示文字


        var goLeft = 100 * (tvalue - o.siderData.min) / (o.siderData.max - o.siderData.min);
        tselection.css("left", "" + goLeft + "%");
        tselection.css("width", "" + (100 - goLeft) + "%");
        thandle.css("left", "" + goLeft + "%");
        ttooltip.css("left", "" + goLeft + "%");
        ttooltip.css("margin-left", "-" + (ttooltip.width() / 2) + "px");
    },
    initToolCharts: function () {
        var aA = $("#tool_chart a");
        for (var i = 0; i < aA.length; i++) {
            aA[i].onclick = function () {
                let oIds = e.createCharts();
                drawChats(this.getAttribute("data-type"), oIds);
            }
        }
    },
    initCanvas: function () {
        for (let i = 0; i < o.arrCanvasIds.length; i++) {
            document.getElementById(o.arrCanvasIds[i]).classList.remove("selected");
            document.getElementById(o.arrCanvasIds[i]).style.display = "none";
        }
    },
    initBg: function () {
        $('#blackimg').attr("class", "icon_checked");
        $('.setup_bg').addClass('hide');
        $('#bottomimg').attr('src', '');
        e.getCurCanvas().getElementsByClassName('d-image')[0].style.display = "none";
    },
    createCanvas: function () {
        this.initCanvas();
        var canvaseId = "canvas-" + getCurTime();
        o.curCanvasId = canvaseId;
        o.arrCanvasIds.push(canvaseId);
        this.createSlidePanel(canvaseId);
        this.initSlidePanel();

        //添加内容面板
        let divCanvasBox = document.getElementsByClassName("canvas_box_main")[0];
        let divCanvas = document.createElement("div");
        divCanvas.setAttribute('id', canvaseId);
        divCanvas.setAttribute('class', 'dElement dCanvas hover light selected');
        divCanvas.style.position = "absolute";
        divCanvas.style.backgroundColor = "transparent";
        divCanvas.style.top = "45px";
        divCanvas.style.left = "40px";
        divCanvas.style.right = "50px";
        divCanvas.style.bottom = "40px";
        divCanvasBox.appendChild(divCanvas);

        let divBg = document.createElement("div");
        divBg.setAttribute('class', 'd-background');
        divBg.style.position = "absolute";
        divBg.style.width = "100%";
        divBg.style.height = "100%";
        divBg.style.margin = "0";
        divBg.style.padding = "0";
        divBg.style.top = "0";
        divBg.style.left = "0";
        divBg.style.zIndex = "1";
        divCanvas.appendChild(divBg);

        let imgBg = document.createElement("img");
        imgBg.setAttribute('class', 'd-image');
        imgBg.style.position = "absolute";
        imgBg.style.width = "100%";
        imgBg.style.height = "100%";
        imgBg.style.margin = "0";
        imgBg.style.padding = "0";
        imgBg.style.top = "0";
        imgBg.style.left = "0";
        imgBg.style.border = "none";
        imgBg.style.zIndex = "2";
        imgBg.style.display = "none";
        divCanvas.appendChild(imgBg);

        let divContent = document.createElement("div");
        divContent.setAttribute('class', 'd-content');
        divContent.style.position = "relative";
        divContent.style.width = "100%";
        divContent.style.height = "100%";
        divContent.style.margin = "0";
        divContent.style.padding = "0";
        divContent.style.top = "0";
        divContent.style.left = "0";
        divContent.style.zIndex = "3";
        divCanvas.appendChild(divContent);

        this.initBg();

        $('#'+canvaseId).click(function(){
            $(this).find('.input-box').removeClass('active');
            $('#text-edit-panel').css("display",'none');
            $('#cannavas-edit-panel').css("display",'block');
            e.updateTextPanel( o.curTextPanelId);
        });
    },
    getCurCanvas: function () {
        let curCanvas = document.getElementById(o.curCanvasId);
        return curCanvas
    },
    getCanvasById: function (id) {
        let canvas = document.getElementById(id);
        return canvas;
    },
    initSlidePanel: function () {
        var aSidePanels = $(".canvas-tumbnail-list li")
        for (let j = 0; j < aSidePanels.length; j++) {
            aSidePanels[j].onclick = function (event) {
                if (event.target.className.indexOf('glyphicon') != -1) return;
                for (let i = 0; i < aSidePanels.length; i++) {
                    aSidePanels[i].classList.remove("active");
                    document.getElementById(aSidePanels[i].getAttribute("id").slice(2)).classList.remove("selected");
                    document.getElementById(aSidePanels[i].getAttribute("id").slice(2)).style.display = "none";
                }
                this.classList.add("active");
                o.curCanvasId = this.getAttribute("id").slice(2);
                document.getElementById(this.getAttribute("id").slice(2)).classList.add("selected");
                document.getElementById(this.getAttribute("id").slice(2)).style.display = "block";
            }
            if (o.curCanvasId == aSidePanels[j].getAttribute('id').slice(2)) {
                aSidePanels[j].classList.add('active');
            } else {
                aSidePanels[j].classList.remove("active");
            }
        }
    },
    createSlidePanel: function (canvasId) {
        let dataId = 's-' + canvasId;
        let ulBox = $(".canvas-tumbnail-list")[0];
        let liBox = document.createElement("li");
        liBox.setAttribute("class", "dui-canvas-item canvas_small_thumbnail active");
        liBox.setAttribute("id", dataId);
        liBox.style.cursor = "pointer";
        ulBox.appendChild(liBox);
        liBox.innerHTML =
            "<div class='canvas_small'>\
                    <img src='./images/canvas.png' alt=''>\
                    <div class='canvas_tip' style='display: none;'>\
                        <p>要删除此画布吗?</p>\
                        <div>\
                            <a data-id='" + dataId + "' class='btn btn-green btn-xsm btn-ok-btn'>确认</a>\
                            <a class='btn btn-grey btn-xsm ml5 btn-cancel-btn'>取消</a>\
                        </div>\
                    </div>\
                    </div>\
                <div class='m_sn'>" + o.arrCanvasIds.length + "</div>\
                <div class='canvas_dsm'>\
                    <a class='canvas-up-index' data-id='" + dataId + "' onclick='upCanvas(this)'><i class='glyphicon glyphicon-arrow-up'></i></a>\
                    <a class='canvas-down-index' data-id='" + dataId + "' onclick='downCanvas(this)'><i class='glyphicon glyphicon-arrow-down'></i></a>\
                    <a class='canvas-remove' onclick='removeCanvas(this)' data-id='" + dataId + "'><i class='glyphicon glyphicon-trash'></i></a>\
                    <a class='canvas-copy' data-id='" + dataId + "' data-index='0'><i class='glyphicon glyphicon-file'></i></a>\
                    <a class='canvas-add' data-id='" + dataId + "' data-index='0'><i class='glyphicon glyphicon-plus'></i></a>\
                </div>\
                ";
    },

    // 创建预览侧边栏
    createPreviewSlide: function () {
        var str = "";
        for (let i = 0; i < o.arrCanvasIds.length; i++) {
            str += `
                    <li index="` + i + `" canvasid="` + o.arrCanvasIds[i] + `">
                        <div class="canvas_small canvastab" id="pre-s-` + o.arrCanvasIds[i] + `"> 
                            <img src="images/canvas.png" title="未命名` + (i + 1) + `" alt="未命名1"> </div>
                        <div class="m_sn">` + (i + 1) + `</div>
                     </li>
                    `;
        }
        $('.layer_canvas_box ul').empty();
        $('.layer_canvas_box ul').append(str);
        var curIndex = o.getCurCanvasIndex();
        $('.layer_canvas_box ul li').each(function (index) {
            if (index == curIndex) {
                $(this).addClass('active');
                $('#dashboard_preview_title').text("未命名" + (curIndex + 1));
            }
        });
        $('.layer_canvas_box ul').on('click', 'li', function () {
            $(this).addClass('active');
            $('#dashboard_preview_title').text("未命名" + (parseInt($(this).attr('index')) + 1));
            $(this).siblings().removeClass('active');

            e.getCurCanvas().style.display = "none";
            $('.canvas_box_main').append(e.getCurCanvas());
            o.setCurCanvasId($(this).attr('canvasid'));
            e.getCurCanvas().style.display = "block";
            $('#preview-box').append(e.getCurCanvas());
        });
    },

    //创建图表
    createCharts: function () {
        let curCanvas = this.getCurCanvas();
        let content = curCanvas.getElementsByClassName("d-content")[0];
        let curTime = getCurTime();
        let boxId = 'chart-' + curTime + '-dom';
        let containerId = 'chart-' + curTime + '-container';


        let divDom = document.createElement("div");
        divDom.setAttribute('class', 'd-mychat-dom');
        divDom.setAttribute('id', boxId);
        divDom.innerHTML = `
                            <div id="` + containerId + `" class="d-mychat-dom-container">
                            </div>
                            <div class="resizeL"></div>
                            <div class="resizeT"></div>
                            <div class="resizeR"></div>
                            <div class="resizeB"></div>
                            <div class="resizeLT"></div>
                            <div class="resizeTR"></div>
                            <div class="resizeBR"></div>
                            <div class="resizeLB"></div>
                            <div class="d-sider " style="position: absolute; top: 0; right: 0; width: 20px; z-index: 4;height: auto;">
                            <a onclick="removeBox('` + boxId + `')"  style="margin: 0px 1px 0px 0px; display: inline-block; text-align: center; width: 20px; height: 20px; line-height: 20px; font-size: 12px;" class="btn-green btn-remove">
                            <i class="glyphicon glyphicon-remove"></i>
                            </a>
                            </div>
                        `;

        content.appendChild(divDom);
        initResize(boxId, containerId, content);
        return {
            boxId: boxId,
            containerId: containerId
        }
    },

    // 
    initText:function(){

    },
    //初始化文本设置面板
    initTextPanel:function(id){
        var oText = o.textPanels[id];
        // 加粗/斜体/下划线
        if(oText.isWeight)$('#text-weight').addClass('active');
        else $('#text-weight').removeClass('active');

        if(oText.isTilt)$('#text-tilt').addClass('active');
        else $('#text-tilt').removeClass('active');

        if(oText.isUnderline)$('#text-underline').addClass('active');
        else $('#text-underline').removeClass('active');
    
        // // 边距
        // $('#text-margin-left-input').val(oText.margin.left);
        // $('#text-margin-right-input').val(oText.margin.right);
        // $('#text-margin-top-input').val(oText.margin.top);
        // $('#text-margin-bottom-input').val(oText.margin.bottom);

        //字体
        $('#text-font-family-select').val(oText.font.family);
        $('#text-font-color').css({'background':oText.font.color});
        $('#text-font-size').val(oText.font.size);
        $('#text-font-space').val(oText.font.letterSpacing);
        $('#text-font-height').val(oText.font.lineHeight);

        //底色
        $('#text-border-color-div').css({'background':oText.backgroundColor});
        $('#text-opacity-input').val(oText.opacity);

        //边框
        $('#text-border-line-select').val(oText.border.line);
        $('#text-border-weight-input').val(oText.border.weight);
        $('#text-border-radius-input').val(oText.border.radius);
        $('#text-border-color-input').css({'background':oText.border.color});
    },
    updateTextPanel:function(id){
        var oText = o.textPanels[id];

        if($('#text-weight').hasClass('active')) oText.isWeight = true;
        else  oText.isWeight = false;

        if($('#text-tilt').hasClass('active')) oText.isTilt = true;
        else  oText.isTilt = false;

        if($('#text-underline').hasClass('active')) oText.isUnderline = true;
        else  oText.isUnderline = false;

        // oText.margin.left =  $('#text-margin-left-input').val();
        // oText.margin.right =  $('#text-margin-right-input').val();
        // oText.margin.top =  $('#text-margin-top-input').val();
        // oText.margin.bottom =  $('#text-margin-bottom-input').val();

        oText.font.family =  $('#text-font-family-select').val();
        oText.font.color =  $('#text-font-color').css('background-color');
        oText.font.size =  $('#text-font-size').val();
        oText.font.letterSpacing =   $('#text-font-space').val();
        oText.font.lineHeight =  $('#text-font-height').val();

        oText.backgroundColor =  $('#text-border-color-div').css('background');
        oText.opacity =  $('#text-opacity-input').val();

        oText.border.line = $('#text-border-line-select').val();
        oText.border.weight = $('#text-border-weight-input').val();
        oText.border.radius =  $('#text-border-radius-input').val();
        oText.border.color =  $('#text-border-color-input').css('background-color');

        this.setTextStyle(id);
    },
    setTextStyle:function(id){
        var oText = o.textPanels[id];
        var fontWeight = oText.isWeight?'bold':'normal';
        var fontTilt = oText.isTilt?'italic':'normal';
        var textDecoration = oText.isUnderline?'underline':'none';
        $('#'+id+' textarea').css(
            {
                'font-weight':fontWeight,
                'font-style':fontTilt,
                'text-decoration':textDecoration,
                'color':oText.font.color,
                'font-family':oText.font.family,
                'font-size': oText.font.size+'px',
                'letter-spacing':oText.font.letterSpacing+'px',
                'line-height':oText.font.lineHeight+'px',
                'background':oText.backgroundColor,
                'opacity':oText.opacity,
                'border-style':oText.border.line,
                'border-width':oText.border.weight+'px',
                'border-radius':oText.border.radius+'px',
                'border-color':oText.border.color,
            }
        );
        
    }
}


function upCanvas(event) {
    cancelBubble();
    let li = event.parentNode.parentNode;
    let id = li.getAttribute("id").slice(2);
    // 更新数组
    var index = 0;
    for (var i = 0; i < o.arrCanvasIds.length; i++) {
        if (o.arrCanvasIds[i] == id) {

            index = i;
            break;
        }
    }
    if (index == 0) return;
    arrChange(o.arrCanvasIds, index, index - 1);

    // 调整侧边栏顺序
    if ($(li).prev()) {
        $(li).prev().before($(li));
    }

    // 修改侧边栏数据
    let arrLis = $(".canvas-tumbnail-list li");
    for (let i = 0; i < arrLis.length; i++) {
        let msn = arrLis[i].getElementsByClassName("m_sn")[0];
        msn.innerHTML = i + 1;
    }
}

function downCanvas(event) {
    cancelBubble();
    let li = event.parentNode.parentNode;
    let id = li.getAttribute("id").slice(2);
    // 更新数组
    var index = 0;
    for (var i = 0; i < o.arrCanvasIds.length; i++) {
        if (o.arrCanvasIds[i] == id) {

            index = i;
            break;
        }
    }
    if (index == 0) return;
    arrChange(o.arrCanvasIds, index, index - 1);

    // 调整侧边栏顺序
    if ($(li).next()) {
        $(li).next().after($(li));
    }

    // 修改侧边栏数据
    let arrLis = $(".canvas-tumbnail-list li");
    for (let i = 0; i < arrLis.length; i++) {
        let msn = arrLis[i].getElementsByClassName("m_sn")[0];
        msn.innerHTML = i + 1;
    }
}

function removeCanvas(event) {
    cancelBubble();
    //移除左边面板
    let li = event.parentNode.parentNode;
    let id = li.getAttribute("id").slice(2);
    li.parentNode.removeChild(li);

    //移除右边面板
    var canvas = document.getElementById(id);
    canvas.parentNode.removeChild(canvas);

    //更新数组
    for (var i = 0; i < o.arrCanvasIds.length; i++) {
        if (o.arrCanvasIds[i] == id) {
            o.arrCanvasIds.splice(i, 1)
            break;
        }
    }
    if (id == o.curCanvasId) o.curCanvasId = o.arrCanvasIds[0];
    //左边面板顺序刷新
    let arrLis = $(".canvas-tumbnail-list li");
    for (let i = 0; i < arrLis.length; i++) {
        let msn = arrLis[i].getElementsByClassName("m_sn")[0];
        msn.innerHTML = i + 1;
    }
    e.initSlidePanel();
}

function addInput() {
    let curCanvas = e.getCurCanvas();
    let content = curCanvas.getElementsByClassName("d-content")[0];
    let divDom = document.createElement('div');
    divDom.setAttribute('class', 'input-box');
    let curTime = getCurTime();
    let boxId = 'input-' + curTime + '-dom';
    let containerId = 'input-' + curTime + '-container';
    divDom.setAttribute('id', boxId);
    divDom.innerHTML = `
                        <div class="input-container">
                        <textarea placeholder="请输入文字" wrap="hard" class="dText-text" class="dText-text" 
                        style="z-index:100; padding: 0px; border-style: none; border-width: 1.11333px; overflow: hidden; width: 100%; height: 100%; font-weight: normal; font-style: normal; text-align: left; font-family: SimSun; font-size: 22.2667px; letter-spacing: 1.11333px; line-height: 33.4222px; text-decoration: none; background-color: transparent; opacity: 1; border-radius: 5.56667px; border-color: rgb(170, 170, 170)
                        "></textarea>
                        </div>
                        <div class="resizeL"></div>
                        <div class="resizeT"></div>
                        <div class="resizeR"></div>
                        <div class="resizeB"></div>
                        <div class="resizeLT"></div>
                        <div class="resizeTR"></div>
                        <div class="resizeBR"></div>
                        <div class="resizeLB"></div>
                        <div class="move-btn" id="` + containerId + `"></div>
                        <div class="d-sider " style="position: absolute; top: 0; right: 0; width: 20px; z-index: 4;height: auto;">
                            <a onclick="removeBox('` + boxId + `')" style="margin: 0px 1px 0px 0px; display: inline-block; text-align: center; width: 20px; height: 20px; line-height: 20px; font-size: 12px;" class="btn-green btn-remove">
                            <i class="glyphicon glyphicon-remove"></i>
                            </a>
                        </div>
                        `;
    content.appendChild(divDom);
    initResize(boxId, containerId, content);
    o.textPanels[boxId] = {
        isWeight:false,           // 是否加粗
        isTilt:false,             // 是否倾斜
        isUnderline:false,        // 是否有下划线
        // margin:{
        //     left:0,
        //     right:0,
        //     top:0,
        //     bottom:0
        // },
        font:{
            family:'Microsoft YaHei',
            color:'#000',
            size:'20',
            letterSpacing:'1',
            lineHeight:'30',
        },
        backgroundColor:'transparent',
        opacity:'1',
        border:{
            line:'none',
            weight:'1',
            radius:'5',
            color:'#000'
        }
    }
    $("#"+boxId +" textarea").click(function(event){
        if (event && event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    });
    $("#"+boxId +" textarea").focus(function(){
        $('#cannavas-edit-panel').css("display",'none');
        $('#text-edit-panel').css("display",'block');
        $("#"+boxId).addClass("active");
        o.curTextPanelId = boxId;
        e.initTextPanel(boxId);
        
    });
    $("#"+boxId +" textarea").blur(function(){
        
    });
}

function removeBox(boxId) {
    var divBox = document.getElementById(boxId);
    divBox.parentNode.removeChild(divBox);
}
//=========================================================================================================