$(function () {
    // 字典初始化完成回调函数
    var url_demo = window.location.href;
    var arr_d = url_demo.split("?");
    var reg = new RegExp("=", "g");
    var reg1 = new RegExp("&", "g");
    var reg2 = new RegExp("-", "g");
    var reg3 = new RegExp("", "g");
    var abc = "[{" + arr_d[1].replace(reg2, "").replace(reg, ":'").replace(reg1, "',") + "'}]";
    console.log(abc)

    var data_info = eval("(" + abc + ")");
    console.log(data_info)

    uniqueId = data_info[0].uniqueId;
    UserId = data_info[0].userId;
    appNo = data_info[0].applyNo;
    MobilePhone = data_info[0].MobilePhone;
    Application = data_info[0].XApplicationId;
    Version = data_info[0].XAPIVersion;
    Client = data_info[0].XClient;
    Token = data_info[0].XToken;
    productCode = data_info[0].type;
    $(".steps").removeClass("diso_s");
    $(".button").text("下一步");
    Dictionary.load();
    if (productCode == "1") {
        $(".sp_d_header1").addClass("diso_s");
        title = {"title": ["基本信息", "辅助信息", "攒信用", "人脸识别", "上传资料"], "index": 2}
    } else if (productCode == "2") {
        $(".sp_d_header2").addClass("diso_s");
        title = {"title": ["基本信息", "辅助信息", "人脸识别", "上传资料"], "index": 2}
    } else if (productCode == "3") {
        $(".sp_d_header3").addClass("diso_s");
        if (window.NEW_PROCESS) {
            title = {"title": ["基本信息", "辅助信息", "人脸识别", "授信", "上传资料"], "index": 2};
        } else {
            title = {"title": ["基本信息", "辅助信息", "人脸识别", "上传资料", "授信"], "index": 2};
        }
    } else if (productCode == "4") {
        $(".sp_d_header4").addClass("diso_s");
        title = {"title": ["基本信息", "辅助信息", "上传资料"], "index": 2}
    } else if (productCode == "0") {
        $(".button").text("保存");
        title = {"title": [], "index": 2}
    }
    //已婚，则默认为配偶，否者进行下拉选项
    $("#familyMaritalStatus").change(function () {
        if ($(this).val() == "20") {
            $("#allRelation").html("<option value='RF01' selected>配偶</option>");
            ishave_select($("#allRelation"));
            $("#allRelation").val("RF01").trigger('change');
            $(".allRelation").text("配偶");
            $(".allRelation").css("color", "rgb(169, 169, 169)");
            $("#allRelation").css("display", "none")
        } else if (($(this).val() == "10") || ($(this).val() == "90")) {
            $("#allRelation").css("display", "block");
            $("#allRelation").find("option").remove();
            $(".allRelation").text("请选择与申请人关系");
            $(".allRelation").css("color", "rgb(169, 169, 169)");
            $("#allRelation").attr("data-rule", "required");
            $("#allRelation").html("<option value=''>请选择与申请人关系</option><option value='RF02'>父亲</option><option value='RF03'>母亲</option><option value='RF04'>兄弟</option><option value='RF05'>姐妹</option><option value='RF06'>子女</option>");
        }
    })
    var a;
    window.native = {};
    native.basicInfoNext = function () {
    };
    native.gotoNextpage = function () {
    };
    native.assistInfoNext = function () {
    };
    native.selectContact = function () {
    };
    native.selectDate = function () {
    };
    $("#begin_time, #begin_rork").click(function () {
        var param = {format: 'yyyy-MM'};
        param.min = "1990";
        // 验证格式
        var value = $(this).val();
        if (/^[\d]{4}-[\d]{2}(-[\d]{2})?$/.test(value)) {
            param.current = value;
        }
        str_id = $(this).attr("id");
        native.selectDate(JSON.stringify(param));
    })
    window.dateInfo = function(string_val) {
        if (str_id == "begin_time") {
            $("#begin_time").val(string_val);
        }
        if (str_id == "begin_rork") {
            $("#begin_rork").val(string_val);
        }
    }

    window.add = function(data_json) {
        var aaa = JSON.parse(data_json);
        sessionStorage.setItem("json_none", JSON.stringify(aaa));
    }

    var data_string_url = urlapi + "/msjrapi/customer/cust_info";
    $.ajax({
        type: 'GET',
        url: data_string_url,
        dataType: 'json',
        headers: {
            "X-Application-Id": Application,
            "X-API-Version": Version,
            "X-Token": Token,
            "X-Client": Client,
            "X-App-Package-Name": "com.msxf.loan.internal.dev"
        },
        success: function (data) {
            data = data || {};
            $(".item-content.bottom_line").addClass("add_line");
            //联系地址
            $(".iosCheck").find("input").click(function () {
                if ($(this).prop("checked")) {
                    $(".address_add").hide();
                    $(".address_add").find("input").attr("data-rule", "");
                    if (data.base_info) {
                        var address = (data.base_info.province || '') + (data.base_info.city || '') + (data.base_info.zone || '') + (data.base_info.detail || '');
                        $(".address_add").find("input").val(address);
                    }
                } else {
                    $(".address_add").show();
                    $(".address_add").find("input").attr("data-rule", "required");
                }
            });
            if (data.other_info) {
                //拉去数据联系人赋值
                if (data.other_info.contacts.length == 1 && data.other_info.marital_status == "90") {
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                }
                if (data.other_info.contacts.length == 2) {
                    $("#allRelation").val(data.other_info.contacts[0].relationship).trigger('change');
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    $(".next_cilck").before("<div class='item_other' id='list_1'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>1</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' data-rule-msg='姓名：请输入2到20个汉字' class='name_all1'  maxlength='15'/></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' maxlength='11' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' /></div><span></span></li></div>");
                    Dictionary.load($("#list_1").find("select"), function () {
                    });
                    add_link();
                    $("#list_1").find("select.allRelation1").val(data.other_info.contacts[1].relationship).trigger('change');
                    $("#list_1").find(".pho_mobile1").val(data.other_info.contacts[1].phone_number);
                    $("#list_1").find(".name_all1").val(data.other_info.contacts[1].name);
                }
                if (data.other_info.contacts.length == 3) {
                    $("#allRelation").val(data.other_info.contacts[0].relationship).trigger('change');
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    $(".next_cilck").before("<div class='item_other' id='list_1'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>1</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' data-rule-msg='姓名：请输入2到20个汉字' class='name_all1' maxlength='15' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' maxlength='11' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' /></div><span></span></li></div><div class='item_other' id='list_2'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>2</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' data-rule-msg='姓名：请输入2到20个汉字' maxlength='15' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' maxlength='11' class='pho_mobile1' /></div><span></span></li></div>");
                    Dictionary.load($("#list_1").find("select"), function () {
                    });
                    Dictionary.load($("#list_2").find("select"), function () {
                    });
                    add_link();
                    $("#list_1").find("select.allRelation1").val(data.other_info.contacts[1].relationship).trigger('change');
                    $("#list_1").find(".pho_mobile1").val(data.other_info.contacts[1].phone_number);
                    $("#list_1").find(".name_all1").val(data.other_info.contacts[1].name);
                    $("#list_2").find("select.allRelation1").val(data.other_info.contacts[2].relationship).trigger('change');
                    $("#list_2").find(".pho_mobile1").val(data.other_info.contacts[2].phone_number);
                    $("#list_2").find(".name_all1").val(data.other_info.contacts[2].name);
                }
                if (data.other_info.contacts.length >= 4) {
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    $(".next_cilck").before("<div class='item_other' id='list_1'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>1</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' data-rule-msg='姓名：请输入2到20个汉字' class='name_all1'  maxlength='15' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' maxlength='11'/></div><span></span></li></div><div class='item_other' id='list_2'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>2</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' maxlength='15'  placeholder='请输入联系人姓名' data-rule='required name_self' data-rule-msg='姓名：请输入2到20个汉字' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value=''data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile'maxlength='11' class='pho_mobile1' maxlength='11'/></div><span></span></li></div><div class='item_other' id='list_3'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>3</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' maxlength='15' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1'maxlength='11' /></div><span></span></li></div>");
                    Dictionary.load($("#list_1").find("select"), function () {
                    });
                    Dictionary.load($("#list_2").find("select"), function () {
                    });
                    Dictionary.load($("#list_3").find("select"), function () {
                    });
                    add_link();
                    $("#list_1").find("select.allRelation1").val(data.other_info.contacts[1].relationship).trigger('change');
                    $("#list_1").find(".pho_mobile1").val(data.other_info.contacts[1].phone_number);
                    $("#list_1").find(".name_all1").val(data.other_info.contacts[1].name);
                    $("#list_2").find("select.allRelation1").val(data.other_info.contacts[2].relationship).trigger('change');
                    $("#list_2").find(".pho_mobile1").val(data.other_info.contacts[2].phone_number);
                    $("#list_2").find(".name_all1").val(data.other_info.contacts[2].name);
                    $("#list_3").find("select.allRelation1").val(data.other_info.contacts[3].relationship).trigger('change');
                    $("#list_3").find(".pho_mobile1").val(data.other_info.contacts[3].phone_number);
                    $("#list_3").find(".name_all1").val(data.other_info.contacts[3].name);
                }
            }

            num = $(".item_other").length;
            if (num == 3) {
                $(".next_cilck").hide();
            }

            if (data.other_info) {
                var data_social = data.other_info.social_statuses;
                //单独设置联系人关系
                if (data.other_info.contacts.length != 0 && data.other_info.contacts[0].relationship != "undefined") {
                    $("#familyMaritalStatus").val(data.other_info.marital_status).trigger('change');
                    $("#allRelation").val(data.other_info.contacts[0].relationship).trigger('change');
                } else {
                    $("#familyMaritalStatus").val("");
                    $("#allRelation").val("");
                }
                //根据不同的社会联系人身份显示不同字段赋值
                if (typeof(data.other_info.social_statuses) != 'undefined' && data_social != "SI01") {
                    $(".unemployed, .personality, .boss_work_time").css("display", "none");
                    $(".data_choose").each(function() {
                        var rule = $(this).data('rule');
                        if (rule) {
                            $(this).data('defaultRule', rule);
                        }
                        $(this).data("rule", "");
                    });
                    $("#socialStatus_loan").val(data.other_info.social_statuses).trigger('change');
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    if (typeof(data.other_info.contacts[0].address) != 'undefined') {
                        $(".address_all").val(data.other_info.contacts[0].address);
                    }
                    if (data_social == "SI02" || data_social == "SI04") {
                        $(".item-content.bottom_line").removeClass("add_line")
                        //$(".boss_work_list").css("display", "block");

                        $(".boss_work_list").css("display", "block");
                        $(".unemployed").find(".begin_works").css('display','block');

                        $(".boss_work_list").find("#education").attr("data-rule", "required");
                        $(".region-item").css("display", "block");
                        $(".boss_work_time, .unemployed, .personality").css("display", "block");
                        $(".boss_work_time, .unemployed, .personality").find(".data_choose").each(function() {
                            $(this).data("rule", $(this).data('defaultRule') || "required");
                        });
                        $("#education").val($.empty2def(data.other_info.edu_backgrounds)).trigger('change');
                        $(".shouru_q").val($.empty2def(data.other_info.salary_amount));
                        $(".shouru_t").val($.empty2def(data.other_info.other_income_amount));
                        $(".shouru_k").val($.empty2def(data.other_info.other_loan_amount));
                        $(".work_a").val(data.other_info.worker.name);
                        $(".begin_time").val(data.other_info.worker.date_to_work);
                        if (typeof(data.other_info.worker.telephone) != 'undefined') {
                            $(".pho_work").val(data.other_info.worker.telephone);
                        }
                        if (typeof(data.other_info.worker.extension) != 'undefined') {
                            $(".run_number").val(data.other_info.worker.extension);
                        }
                        $("#provinceCode").val(data.base_info.province_code).trigger('change');
                        $(".cityCode").val(data.base_info.city_code).trigger('change');
                        $(".zoneCode").val(data.base_info.zone_code).trigger('change');
                        $(".address").val(data.other_info.worker.detail);
                        $(".begin_rork").val(data.other_info.worker.employment_date);
                    } else if (data_social == "SI03" || data_social == "SI05" || data_social == "SI06") {
                        $(".boss_work_list").css("display", "block");
                        $(".item-content.bottom_line").removeClass("add_line")
                        $(".boss_work_list").find("#education").attr("data-rule", "required");
                        $("#education").val($.empty2def(data.other_info.edu_backgrounds)).trigger('change');
                        $(".shouru_q").val($.empty2def(data.other_info.salary_amount));
                        $(".shouru_t").val($.empty2def(data.other_info.other_income_amount));
                        $(".shouru_k").val($.empty2def(data.other_info.other_loan_amount));
                        $(".personality").css("display", "block");
                        $(".personality").find(".data_choose").each(function() {
                            $(this).data("rule", $(this).data('defaultRule') || "required");
                        });
                    } else if (data_social == "SI07" || data_social == "SI08") {
                        $(".item-content.bottom_line").addClass("add_line")
                        $(".boss_work_list").css("display", "none");
                        $(".boss_work_list").find("#education").attr("data-rule", "");

                        //职位信息
                        $(".boss_work_list").find("#position_job").attr("data-rule", "");

                        $(".boss_work").css("display", "block");
                        $(".boss_work").find(".data_choose").each(function() {
                            $(this).data("rule", $(this).data('defaultRule') || "required");
                        });
                        $(".boss_work_time").css("display", "none");
                        $(".boss_work_time").find(".data_choose").attr("data-rule", "");
                        $(".work_a").val(data.other_info.worker.name);
                        if (typeof(data.other_info.worker.telephone) != 'undefined') {
                            $(".pho_work").val(data.other_info.worker.telephone);
                        }
                        if (typeof(data.other_info.worker.extension) != 'undefined') {
                            $(".run_number").val(data.other_info.worker.extension);
                        }
                        $("#provinceCode").val(data.base_info.province_code).trigger('change');
                        $(".cityCode").val(data.base_info.city_code).trigger('change');
                        $(".zoneCode").val(data.base_info.zone_code).trigger('change');
                        $(".address").val(data.other_info.worker.detail);
                    }
                }
            }
        },
        complete: function(e) {
            // 用户行为监测
            behave();
        }
    })
    data_list = new Array();
//定义时间初始化
    function show() {
        s = new Date().getTime();
    }

//是否修改初始化
    var isHave = 0;
    var Flag = 0;
//input输入框
    function ishave_select(event_e) {
        if (event_e.val() == "undefind" || event_e.val() == null || event_e.val() < 1 || event_e.val() == "") {
            event_e.attr("isHave", 0);
        } else {
            event_e.attr("isHave", 1);
        }
    };
    function ishave_input(val) {
        if (val == "undefind" || val == null || val.length < 1 || val == "") {
            var isHave = 0;
        } else {
            var isHave = 1;
        }
    };
    function isduration(duration, isHave) {
        return duration > 0 && parseInt(isHave) == 0 ? 1 : 0;
    }

    var a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, b1, b2, b3, b4, b5, b6, c1, c2, c3, c4, c5, c6, c7, c8, c11, s1, s2, s3, s4, s5, s6, r1, r2, r3, r4, r5, r6, y1, y2, y3, y4, y5, y6;

    function behave() {

//加载项初始化
//社会身份
        data0 = {'item': 'socialStatus', 'isHave': 1, 'Flag': 0, 'duration': 0}
//教育程度
        data1 = {'item': 'education', 'isHave': 1, 'Flag': 0, 'duration': 0};
//工作收入
        data2 = {'item': 'shouru_q', 'isHave': 1, 'Flag': 0, 'duration': 0}
//其它收入
        data3 = {'item': 'shouru_t', 'isHave': 1, 'Flag': 0, 'duration': 0};
//其它贷款
        data4 = {'item': 'shouru_k', 'isHave': 1, 'Flag': 0, 'duration': 0}
//单位全称
        data5 = {'item': 'work_a', 'isHave': 1, 'Flag': 0, 'duration': 0};
//单位电话
        if ($(".pho_work").val() == "") {
            data6 = {'item': 'pho_work', 'isHave': 0, 'Flag': 0, 'duration': 0}
        } else {
            data6 = {'item': 'pho_work', 'isHave': 1, 'Flag': 0, 'duration': 0}
        }
//分机号
        if ($(".run_number").val() == "") {
            data7 = {'item': 'run_num', 'isHave': 0, 'Flag': 0, 'duration': 0};
        } else {
            data7 = {'item': 'run_num', 'isHave': 1, 'Flag': 0, 'duration': 0};
        }
//单位地址
        if ($(".detail").val() == "") {
            data8 = {'item': 'detail', 'isHave': 0, 'Flag': 0, 'duration': 0};
        } else {
            data8 = {'item': 'detail', 'isHave': 1, 'Flag': 0, 'duration': 0};
        }
//婚姻状态
        data9 = {'item': 'familyMaritalStatus', 'isHave': 1, 'Flag': 0, 'duration': 0}
//关系
        data10 = {'item': 'allRelation', 'isHave': 1, 'Flag': 0, 'duration': 0}
//姓名
        data11 = {'item': 'name_all', 'isHave': 1, 'Flag': 0, 'duration': 0}
//手机号
        data12 = {'item': 'pho_mobile', 'isHave': 1, 'Flag': 0, 'duration': 0}
        if ($(".address_all").val() == "") {
            data13 = {'item': 'address_all', 'isHave': 0, 'Flag': 0, 'duration': 0};
        } else {
            data13 = {'item': 'address_all', 'isHave': 1, 'Flag': 0, 'duration': 0};
        }
//省市区
        data_region = {'item': 'region', 'isHave': 1, 'Flag': 0, 'duration': 0}
//参加工作日期
        data_work_time = {'item': 'begin_time', 'isHave': 1, 'Flag': 0, 'duration': 0}
//入职日期
        data_Entry_time = {'item': 'begin_rork', 'isHave': 1, 'Flag': 0, 'duration': 0}

//职位信息
        data20 = {'item': 'position_job', 'isHave': 1, 'Flag': 0, 'duration': 0};

        $("#socialStatus_loan").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            a1 = s;
        })
        $("#socialStatus_loan").one('change', function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('click');
            show();
            a2 = s;
            var duration = Math.ceil((a2 - a1) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data0 = {'item': 'socialStatus', 'isHave': isHave, 'Flag': Flag, 'duration': duration};
        })
//教育程度
        $("#education").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            a3 = s;
        })
        $("#education").one('change', function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('click');
            show();
            a4 = s;
            var duration = Math.ceil((a4 - a3) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data1 = {'item': 'education', 'isHave': $(this).attr("isHave"), 'Flag': Flag, 'duration': duration}
        })

//职位信息
        $("#position_job").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            a3 = s;
        })
        $("#position_job").one('change', function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('click');
            show();
            a4 = s;
            var duration = Math.ceil((a4 - a3) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data20 = {'item': 'position_job', 'isHave': $(this).attr("isHave"), 'Flag': Flag, 'duration': duration}
        })

//工作收入
        $(".shouru_q").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            a7 = s;
        });
        $(".shouru_q").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            a8 = s;
            var duration = Math.ceil((a8 - a7) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data2 = {'item': 'shouru_q', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//其他收入
        $(".shouru_t").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            a9 = s;
        });
        $(".shouru_t").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            a10 = s;
            var duration = Math.ceil((a10 - a9) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data3 = {'item': 'shouru_t', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//其他贷款
        $(".shouru_k").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            a11 = s;
        });
        $(".shouru_k").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            a12 = s;
            var duration = Math.ceil((a12 - a11) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data4 = {'item': 'shouru_k', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//单位全称
        $(".work_a").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            b1 = s;
        });
        $(".work_a").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            b2 = s;
            var duration = Math.ceil((b2 - b1) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data5 = {'item': 'work_a', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//单位电话
        $(".pho_work").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this))
            show();
            b5 = s;
        });
        $(".pho_work").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            b6 = s;
            var duration = Math.ceil((b6 - b5) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data6 = {'item': 'pho_work', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });

//单位分机号
        $(".run_number").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this))
            show();
            b5 = s;
        });
        $(".run_number").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            b6 = s;
            var duration = Math.ceil((b6 - b5) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data7 = {'item': 'run_num', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//省市区
        $("#provinceCode, .cityCode, .zoneCode").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            c11 = s;
        })
        $("#provinceCode, .cityCode, .zoneCode").one('change', function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('click');
            show();
            c12 = s;
            var duration = Math.ceil((c12 - c11) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data_region = {'item': 'region', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        })

//详细地址
        $(".address").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            b9 = s;
        });
        $(".address").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            b10 = s;
            var duration = Math.ceil((b10 - b9) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data8 = {'item': 'detail', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//婚姻
        $("#familyMaritalStatus").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            c1 = s;
        })
        $("#familyMaritalStatus").one('change', function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('click');
            show();
            c2 = s;
            var duration = Math.ceil((c2 - c1) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data9 = {
                'item': 'familyMaritalStatus',
                'isHave': isHave,
                'Flag': Flag,
                'duration': duration
            }
        })

//关系
        $("#allRelation").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            c1 = s;
        })
        $("#allRelation").one('change', function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('click');
            show();
            c4 = s;
            var duration = Math.ceil((c4 - c1) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data10 = {'item': 'allRelation', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//姓名
        $(".name_all").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            c7 = s;
        });
        $(".name_all").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            c8 = s;
            var duration = Math.ceil((c8 - c7) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data11 = {'item': 'name_all', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//手机号
        $(".phone_bt .pho_mobile").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            c5 = s;
        });
        $(".phone_bt .pho_mobile").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            c6 = s;
            var duration = Math.ceil((c6 - c5) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data12 = {'item': 'pho_mobile', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//地址
        $(".address_all").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            c7 = s;
        });
        $(".address_all").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            c8 = s;
            var duration = Math.ceil((c8 - c7) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data13 = {'item': 'address_all', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
        });
//参加工作日期
        $("#begin_time").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this))
            show();
            d1 = s;
        });
        $("#begin_time").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            d2 = s;
            var duration = Math.ceil((d2 - d1) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data_work_time = {
                'item': 'begin_time',
                'isHave': isHave,
                'Flag': Flag,
                'duration': duration
            }
        });
//入职日期
        $("#begin_rork").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this))
            show();
            d3 = s;
        });
        $("#begin_rork").one("blur", function () {
            if ($(this).data('behave') == 'behave') return;
            // 设置用户行为记录标识
            $(this).data('behave', 'behave').off('focus');
            show();
            d4 = s;
            var duration = Math.ceil((d4 - d3) / 1000), isHave = $(this).attr("isHave") || 0;
            var Flag = isduration(duration, isHave);
            data_Entry_time = {
                'item': 'begin_rork',
                'isHave': isHave,
                'Flag': Flag,
                'duration': duration
            }
        });
    }

    function add_link() {
//关系1
        data_allRelation1 = {'item': 'allRelation1', 'isHave': 1, 'Flag': 0, 'duration': 0}
//姓名1
        data_name_all1 = {'item': 'name_all1', 'isHave': 1, 'Flag': 0, 'duration': 0}
//手机号1
        data_pho_mobile1 = {'item': 'pho_mobile1', 'isHave': 1, 'Flag': 0, 'duration': 0}
//关系2
        data_allRelation2 = {'item': 'allRelation2', 'isHave': 1, 'Flag': 0, 'duration': 0}
//姓名2
        data_name_all2 = {'item': 'name_all2', 'isHave': 1, 'Flag': 0, 'duration': 0}
//手机号2
        data_pho_mobile2 = {'item': 'pho_mobile2', 'isHave': 1, 'Flag': 0, 'duration': 0}
//关系3
        data_allRelation3 = {'item': 'allRelation3', 'isHave': 1, 'Flag': 0, 'duration': 0}
//姓名3
        data_name_all3 = {'item': 'name_all3', 'isHave': 1, 'Flag': 0, 'duration': 0}
//手机号3
        data_pho_mobile3 = {'item': 'pho_mobile3', 'isHave': 1, 'Flag': 0, 'duration': 0}
//关系1
        $("#list_1").find(".allRelation1").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            s1 = s;
            $(this).one('change', function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('click');
                show();
                s2 = s;
                var duration = Math.ceil((s2 - s1) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_allRelation1 = {'item': 'allRelation1', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        })
//关系1
        $("#list_2").find(".allRelation1").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            s1 = s;
            $(this).one('change', function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('click');
                show();
                s2 = s;
                var duration = Math.ceil((s2 - s1) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_allRelation2 = {'item': 'allRelation2', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        })
//关系3
        $("#list_3").find(".allRelation1").one('click', function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            s1 = s;
            $(this).one('change', function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('click');
                show();
                s2 = s;
                var duration = Math.ceil((s2 - s1) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_allRelation3 = {'item': 'allRelation3', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        })
//姓名1
        $("#list_1").find(".name_all1").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            s3 = s;
            $(this).one("blur", function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('focus');
                show();
                s4 = s;
                var duration = Math.ceil((s4 - s3) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_name_all1 = {'item': 'name_all1', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        });

//手机号1
        $("#list_1").find(".pho_mobile1").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            s5 = s;
            $(this).one("blur", function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('focus');
                show();
                s6 = s;
                var duration = Math.ceil((s6 - s5) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_pho_mobile1 = {'item': 'pho_mobile1', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        });


//姓名2
        $("#list_2").find(".name_all1").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            r3 = s;
            $(this).one("blur", function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('focus');
                show();
                r4 = s;
                var duration = Math.ceil((r4 - r3) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_name_all2 = {'item': 'name_all2', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        });

//手机号2
        $("#list_2").find(".pho_mobile1").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            r5 = s;
            $(this).one("blur", function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('focus');
                show();
                r6 = s;
                var duration = Math.ceil((r6 - r5) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_pho_mobile2 = {'item': 'pho_mobile2', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        });

//姓名3
        $("#list_3").find(".name_all1").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            y3 = s;
            $(this).one("blur", function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('focus');
                show();
                y4 = s;
                var duration = Math.ceil((y4 - y3) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_name_all3 = {'item': 'name_all3', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        });

//手机号3
        $("#list_3").find(".pho_mobile1").one("focus", function () {
            if ($(this).data('behave') == 'behave') return;
            ishave_select($(this));
            show();
            y5 = s;
            $(this).one("blur", function () {
                if ($(this).data('behave') == 'behave') return;
                // 设置用户行为记录标识
                $(this).data('behave', 'behave').off('focus');
                show();
                y6 = s;
                var duration = Math.ceil((y6 - y5) / 1000), isHave = $(this).attr("isHave") || 0;
                var Flag = isduration(duration, isHave);
                data_pho_mobile3 = {'item': 'pho_mobile3', 'isHave': isHave, 'Flag': Flag, 'duration': duration}
            });
        });

    }


//删除新增联系人
    var num = 0;
    $(".next_cilck").unbind('click').click(function () {
        num++;
        $(this).before("<div class='item_other' id='list_" + num + "'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>" + num + "</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' maxlength='15' placeholder='请输入联系人姓名' data-rule='required name_self' data-rule-msg='姓名：请输入2到20个汉字' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' data-rule-msg=' 请填写正确的联系人手机号码' maxlength='11' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' /></div><span></span></li></div>");
        Dictionary.load($("#list_" + num).find("select"), function () {
        });
        add_link();
        if ($(".allRelation1").text() == "请选择与申请人关系") {
            $(".allRelation1").css("color", "#949292")
        }
        if (num == 3) {
            $(".next_cilck").hide();
        } else {
            $(".next_cilck").show();
        }
    })
//新增联系人
    $(".delete_clear").unbind('click').live("click", function () {
        var obj = $(this).parent().parent().next(".item_other");
        $(this).parent().parent().remove();
        num--;
        while (obj.length != 0) {
            var index = obj.find(".qwert").text() - 1;
            obj.find(".qwert").text(index);
            obj.attr('id', 'list_' + index);
            obj = obj.next(".item_other");
        }
        if (obj.length == 3) {
            $(".next_cilck").hide();
        } else {
            $(".next_cilck").show();
        }
    })
//通讯录
    $(".phone_bt span").live("click", function () {
        mun_id = $(this).parent().parent().attr("id");
        native.selectContact("");
    })
    window.contactInfo = function(name_json) {
        pho_mobile = JSON.parse(name_json);
        if (mun_id == "list_0") {
            $("#list_0").find(".name_all").val(pho_mobile.name);
            $("#list_0").find(".pho_mobile").val(pho_mobile.phone.replace(reg3, ""));
        }
        if (mun_id == "list_1") {
            $("#list_1").find(".name_all1").val(pho_mobile.name);
            $("#list_1").find(".pho_mobile1").val(pho_mobile.phone.replace(reg3, ""));
        }
        if (mun_id == "list_2") {
            $("#list_2").find(".name_all1").val(pho_mobile.name);
            $("#list_2").find(".pho_mobile1").val(pho_mobile.phone.replace(reg3, ""));
        }
        if (mun_id == "list_3") {
            $("#list_3").find(".name_all1").val(pho_mobile.name);
            $("#list_3").find(".pho_mobile1").val(pho_mobile.phone.replace(reg3, ""));
        }

    };
    $("select").live("change", function () {
        var self = $(this);
        var options = self.find("option");
        $.each(options, function (i) {
            if (options[i].selected) {
                self.parent().find(".select_title").html(options[i].text).css("color", "#333");
            }
        })
    });
//社会身份
    $("#socialStatus_loan").on('change', function () {
        $(".unemployed, .personality, .boss_work_time").css("display", "none");
        $(".data_choose").each(function() {
            var rule = $(this).data('rule');
            if (rule) {
                $(this).data('defaultRule', rule);
            }
            $(this).data("rule", "");
        });
        if ($(this).val() == "SI02" || $(this).val() == "SI04") {
            $(".item-content.bottom_line").removeClass("add_line");
            $(".boss_work_list").css("display", "block");
            $(".unemployed").find(".begin_works").css('display','block');
            $(".unemployed").find('.remove_job').remove();

            //$(".boss_work_list").find('.position_job').parent().parent().css('display','none');
            $(".boss_work_list").find('#position_job').removeAttr('data-rule').parent().parent().css('display','none');
            $(".boss_work").find('.pho_work').attr('data-rule','required');
            $(".boss_work_list").find("#education").attr("data-rule", "required");
            $(".unemployed, .personality, .boss_work_time").css("display", "block");
            $(".unemployed, .personality, .boss_work_time").find(".data_choose").each(function() {
                $(this).data("rule", $(this).data('defaultRule') || "required");
            });
        } else if ($(this).val() == "SI03" || $(this).val() == "SI05" || $(this).val() == "SI06") {
            $(".item-content.bottom_line").removeClass("add_line");
            $(".boss_work_list").css("display", "block");
            $(".boss_work_list").find("#education").attr("data-rule", "required");
           // $(".boss_work").find('.pho_work').removeAttr('data-rule');
           // $(".boss_work_list").find('#position_job').removeAttr('data-rule');
            $('.boss_work').find('.pho_work').attr('data-rule','');
            $(".boss_work_list").find('#position_job').attr('data-rule', '');

            $(".personality").css("display", "block");
            $(".personality").find(".data_choose").each(function() {
                $(this).data("rule", $(this).data('defaultRule') || "required");
            });
        } else if ($(this).val() == "SI07" || $(this).val() == "SI08") {
            $(".item-content.bottom_line").addClass("add_line");
            //$(".boss_work_list").css("display", "none");
            $(".boss_work_list").css("display", "block");
            $(".boss_work_list").find("#education").attr("data-rule", "");
            $(".unemployed").find('.begin_works').css('display','none');
            //职位
            $('.position_job').find('#position_job').attr('data-rule',"");
            $('.boss_work').find('.pho_work').attr('data-rule','required');
            $(".boss_work_list").find("#education").attr("data-rule", "required");
            $(".boss_work_list").find('#position_job').attr('data-rule','required');

            $(".unemployed, .personality, .boss_work_time").css("display", "block");
            $(".boss_work").css("display", "block");
            $(".boss_work").find(".data_choose").each(function() {
                $(this).data("rule", $(this).data('defaultRule') || "required");
            });
            $(".work_a").attr("data-rule", "required address");
            $(".boss_work_time").css("display", "none");
            $(".boss_work_time").find(".data_choose").attr("data-rule", "");
        }
    })

//社会身份 -------在职人员、企业负责人
    function button_work() {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus_loan").val();
            var education = $("#education").val();
            var shouru_q = $(".shouru_q").val();
            var shouru_t = $(".shouru_t").val();
            var shouru_k = $(".shouru_k").val();
            var work_a = $(".work_a").val();//单位全称
            var date_to_work = $(".begin_time").val();   //参加工作日期
            var pho_work = $(".pho_work").val(); //单位电话
            var run_number = $(".run_number").val(); //单位分机号
            var province_code = $("#provinceCode").val();  //地址省份
            var city_code = $(".cityCode").val(); //地址市
            var distinct_code = $(".zoneCode").val(); //地址县区
            var detail = $(".address").val();//地址详细地址
            var employment_date = $(".begin_rork").val();  //最近入职时间
            var allRelation = $("#allRelation").val() || 'RF01';   //联系人关系
            var familyMaritalStatus = $("#familyMaritalStatus").val();  //婚姻关系
            var name_all = $(".name_all").val();  //联系人名字
            var pho_mobile = $(".pho_mobile").val();   //联系人度那话
            var detail_address = $(".address_add").find("input").val();   //同现居地址
            var relation1 = $("#list_1").find("select.allRelation1").val();
            var relation2 = $("#list_2").find("select.allRelation1").val();
            var relation3 = $("#list_3").find("select.allRelation1").val();
            var name1 = $("#list_1").find(".name_all1").val();
            var name2 = $("#list_2").find(".name_all1").val();
            var name3 = $("#list_3").find(".name_all1").val();
            var pho_num1 = $("#list_1").find(".pho_mobile1").val();
            var pho_num2 = $("#list_2").find(".pho_mobile1").val();
            var pho_num3 = $("#list_3").find(".pho_mobile1").val();
            var reg_time = new RegExp("-", "g");
            data_from = [data0, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data_region, data_work_time, data_Entry_time];
            //无业
            var contacts = new Array();
            contacts.push({
                'relationship': allRelation || 'RF01',
                'name': name_all,
                'phone_number': pho_mobile,
                'address': detail_address
            });
            if (name1 != undefined && name1 != null && name1 != "") {
                contacts.push({'relationship': relation1, 'name': name1, 'phone_number': pho_num1});
                data_from.push(data_allRelation1, data_name_all1, data_pho_mobile1)
            }
            if (name2 != undefined && name2 != null && name2 != "") {
                contacts.push({'relationship': relation2, 'name': name2, 'phone_number': pho_num2});
                data_from.push(data_allRelation2, data_name_all2, data_pho_mobile2)
            }
            if (name3 != undefined && name3 != null && name3 != "") {
                contacts.push({'relationship': relation3, 'name': name3, 'phone_number': pho_num3});
                data_from.push(data_allRelation3, data_name_all3, data_pho_mobile3)
            }
            var data_ios = {
                "apply_no": appNo, 'social_statuses': socialStatus, 'edu_backgrounds': education,
                'salary_amount': shouru_q, 'other_income_amount': shouru_t, 'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus, "worker": {
                    'name': work_a,
                    'date_to_work': date_to_work,
                    'employment_date': employment_date,
                    'extension': run_number,
                    'telephone': pho_work,
                    'province_code': province_code,
                    'city_code': city_code,
                    'zone_code': distinct_code,
                    'detail': detail
                }, "contacts": contacts, 'top_info': title
            }
            var data = {
                "apply_no": appNo, 'social_statuses': socialStatus, 'edu_backgrounds': education,
                'salary_amount': shouru_q, 'other_income_amount': shouru_t, 'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus, "worker": {
                    'name': work_a,
                    'date_to_work': date_to_work,
                    'extension': run_number,
                    'employment_date': employment_date,
                    'telephone': pho_work,
                    'province_code': province_code,
                    'city_code': city_code,
                    'zone_code': distinct_code,
                    'detail': detail
                }, "contacts": contacts
            }
            var url_other = urlapi + "/msjrapi/customer/submit/other_info";
            var creeper_data = {
                "uniqueId": uniqueId,
                "userId": UserId,
                "uploadTiming": 'apply',
                "appNo": appNo,
                "mobilePhone": MobilePhone,
                "data": JSON.stringify(data_from)
            }
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = (month < 10 ? "0" + month : month);
            var mydate = (year.toString() + month.toString());
            if (pho_work != "" && pho_work[0] != "0" || pho_work != "" && pho_work.length < 9) {
                $.warn("请填写区号+座机号");
                return;
            }
            if (date_to_work.replace(reg_time, "") - mydate > 0) {
                $.warn("请选择参加工作日期");
                return;
            }
            if (employment_date.replace(reg_time, "") - date_to_work.replace(reg_time, "") < 0 || employment_date.replace(reg_time, "") - mydate > 0) {
                $.warn("请选择正确入职日期");
                return;
            }
            if (work_a.length < 4) {
                $.warn("请填写正确的单位全称");
                return;
            }
            if (detail.length < 4) {
                $.warn("请填写正确的单位详细地址");
                return;
            }
            if (detail_address.length < 4) {
                $.warn("请填写正确的联系地址");
                return;
            } else {
                //爬虫行为数据交互
                $.ajax({
                    type: 'get',
                    url: creeper_url,
                    dataType: 'jsonp',
                    data: creeper_data,
                    jsonp: 'callback',
                    success: function (data) {
                    },
                    error: function () {
                    }
                });
                $.ajax({
                    type: 'post',
                    url: url_other,
                    dataType: 'json',
                    data: data,
                    headers: {
                        "X-Application-Id": Application,
                        "X-API-Version": Version,
                        "X-Token": Token,
                        "X-Client": Client,
                        "X-App-Package-Name": "com.msxf.loan.internal.dev"
                    },
                    success: function (data) {
                        native.assistInfoNext(data_ios);
                    }
                });
            }

        }
    }

//个体工商户、个体经营者
    function button_boss() {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus_loan").val();
            var education = $("#education").val();

            var position_job = $('#position_job').val();
            var shouru_q = $(".shouru_q").val();
            var shouru_t = $(".shouru_t").val();
            var shouru_k = $(".shouru_k").val();
            var work_a = $(".work_a").val();//单位全称
            var pho_work = $(".pho_work").val(); //单位电话
            var run_number = $(".run_number").val();
            var province_code = $("#provinceCode").val();  //地址省份
            var city_code = $(".cityCode").val(); //地址市
            var distinct_code = $(".zoneCode").val(); //地址县区
            var detail = $(".address").val();//地址详细地址
            var allRelation = $("#allRelation").val() || 'RF01';   //联系人关系
            var familyMaritalStatus = $("#familyMaritalStatus").val();  //婚姻关系
            var name_all = $(".name_all").val();  //联系人名字
            var pho_mobile = $(".pho_mobile").val();   //联系人度那话
            var detail_address = $(".address_add").find("input").val();   //同现居地址
            var relation1 = $("#list_1").find("select.allRelation1").val();
            var relation2 = $("#list_2").find("select.allRelation1").val();
            var relation3 = $("#list_3").find("select.allRelation1").val();
            var name1 = $("#list_1").find(".name_all1").val();
            var name2 = $("#list_2").find(".name_all1").val();
            var name3 = $("#list_3").find(".name_all1").val();
            var pho_num1 = $("#list_1").find(".pho_mobile1").val();
            var pho_num2 = $("#list_2").find(".pho_mobile1").val();
            var pho_num3 = $("#list_3").find(".pho_mobile1").val();
            data_from = [data0, data5, data6, data7, data8, data9, data10, data11, data12, data13, data20,data_region];
            //无业
            var contacts = new Array();
            contacts.push({
                'relationship': allRelation,
                'name': name_all,
                'phone_number': pho_mobile,
                'address': detail_address
            });
            if (name1 != undefined && name1 != null && name1 != "") {
                contacts.push({'relationship': relation1, 'name': name1, 'phone_number': pho_num1});
                data_from.push(data_allRelation1, data_name_all1, data_pho_mobile1)
            }
            if (name2 != undefined && name2 != null && name2 != "") {
                contacts.push({'relationship': relation2, 'name': name2, 'phone_number': pho_num2});
                data_from.push(data_allRelation2, data_name_all2, data_pho_mobile2)
            }
            if (name3 != undefined && name3 != null && name3 != "") {
                contacts.push({'relationship': relation3, 'name': name3, 'phone_number': pho_num3});
                data_from.push(data_allRelation3, data_name_all3, data_pho_mobile3)
            }
            var data_ios = {
                //"apply_no": appNo, 'social_statuses': socialStatus,
                "apply_no": appNo,
                'social_statuses': socialStatus,
                'edu_backgrounds': education,
                'position_job': position_job,  //职位
                'salary_amount': shouru_q, 'other_income_amount': shouru_t, 'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus, 'top_info': title, "worker": {
                    'name': work_a,
                    'telephone': pho_work,
                    'extension': run_number,
                    'province_code': province_code,
                    'city_code': city_code,
                    'zone_code': distinct_code,
                    'detail': detail
                }, "contacts": contacts
            }
            var data = {
                //"apply_no": appNo, 'social_statuses': socialStatus,
                "apply_no": appNo,
                'social_statuses': socialStatus,
                'edu_backgrounds': education,
                'position_job': position_job,  //职位
                'salary_amount': shouru_q,
                'other_income_amount': shouru_t,
                'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus, "worker": {
                    'name': work_a,
                    'telephone': pho_work,
                    'extension': run_number,
                    'province_code': province_code,
                    'city_code': city_code,
                    'zone_code': distinct_code,
                    'detail': detail
                }, "contacts": contacts
            }
            var url_other = urlapi + "/msjrapi/customer/submit/other_info";
            var creeper_data = {
                "uniqueId": uniqueId,
                "userId": UserId,
                "uploadTiming": 'apply',
                "appNo": appNo,
                "mobilePhone": MobilePhone,
                "data": JSON.stringify(data_from)
            }
            if (work_a.length < 4) {
                $.warn("请填写正确的单位全称");
                return;
            }
            if (detail.length < 4) {
                $.warn("请填写正确的单位详细地址");
                return;
            }
            if (detail_address.length < 4) {
                $.warn("请填写正确的联系地址");
                return;
            } else {
                //爬虫行为数据交互
                $.ajax({
                    type: 'get',
                    url: creeper_url,
                    dataType: 'jsonp',
                    data: creeper_data,
                    jsonp: 'callback',
                    success: function (data) {
                    },
                    error: function () {
                    }
                });
                $.ajax({
                    type: 'post',
                    url: url_other,
                    dataType: 'json',
                    data: data,
                    headers: {
                        "X-Application-Id": Application,
                        "X-API-Version": Version,
                        "X-Token": Token,
                        "X-Client": Client,
                        "X-App-Package-Name": "com.msxf.loan.internal.dev"
                    },
                    success: function (data) {
                        native.assistInfoNext(data_ios);
                    }
                });
            }

        }
    }

//社会身份------自由职业、无业、退休
    function button_text() {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus_loan").val();
            var education = $("#education").val();
            var shouru_q = $(".shouru_q").val();
            var shouru_t = $(".shouru_t").val();
            var shouru_k = $(".shouru_k").val();
            var allRelation = $("#allRelation").val() || 'RF01';
            var familyMaritalStatus = $("#familyMaritalStatus").val();
            var name_all = $(".name_all").val();
            var pho_mobile = $(".pho_mobile").val();
            var detail_address = $(".address_add").find("input").val();
            var relation1 = $("#list_1").find("select.allRelation1").val();
            var relation2 = $("#list_2").find("select.allRelation1").val();
            var relation3 = $("#list_3").find("select.allRelation1").val();
            var name1 = $("#list_1").find(".name_all1").val();
            var name2 = $("#list_2").find(".name_all1").val();
            var name3 = $("#list_3").find(".name_all1").val();
            var pho_num1 = $("#list_1").find(".pho_mobile1").val();
            var pho_num2 = $("#list_2").find(".pho_mobile1").val();
            var pho_num3 = $("#list_3").find(".pho_mobile1").val();
            data_from = [data0, data1, data2, data3, data4, data9, data10, data11, data12, data13];
            //无业
            var contacts = new Array();
            contacts.push({
                'relationship': allRelation || 'RF01',
                'name': name_all,
                'phone_number': pho_mobile,
                'address': detail_address
            });
            if (name1 != undefined && name1 != null && name1 != "") {
                contacts.push({'relationship': relation1, 'name': name1, 'phone_number': pho_num1});
                data_from.push(data_allRelation1, data_name_all1, data_pho_mobile1)
            }
            if (name2 != undefined && name2 != null && name2 != "") {
                contacts.push({'relationship': relation2, 'name': name2, 'phone_number': pho_num2});
                data_from.push(data_allRelation2, data_name_all2, data_pho_mobile2)
            }
            if (name3 != undefined && name3 != null && name3 != "") {
                contacts.push({'relationship': relation3, 'name': name3, 'phone_number': pho_num3});
                data_from.push(data_allRelation3, data_name_all3, data_pho_mobile3)
            }
            var data_ios = {
                "apply_no": appNo, 'social_statuses': socialStatus, 'edu_backgrounds': education,
                'salary_amount': shouru_q, 'other_income_amount': shouru_t, 'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus, 'top_info': title, "contacts": contacts
            }
            var data = {
                "apply_no": appNo, 'social_statuses': socialStatus, 'edu_backgrounds': education,
                'salary_amount': shouru_q, 'other_income_amount': shouru_t, 'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus, "contacts": contacts
            }
            var url_other = urlapi + "/msjrapi/customer/submit/other_info";
            var creeper_data = {
                "uniqueId": uniqueId,
                "userId": UserId,
                "uploadTiming": 'apply',
                "appNo": appNo,
                "mobilePhone": MobilePhone,
                "data": JSON.stringify(data_from)
            }
            //爬虫行为数据交互
            $.ajax({
                type: 'get',
                url: creeper_url,
                dataType: 'jsonp',
                data: creeper_data,
                jsonp: 'callback',
                error: function () {
                }
            });
            // 提交数据
            $.ajax({
                type: 'post',
                url: url_other,
                dataType: 'json',
                data: data,
                headers: {
                    "X-Application-Id": Application,
                    "X-API-Version": Version,
                    "X-Token": Token,
                    "X-Client": Client,
                    "X-App-Package-Name": "com.msxf.loan.internal.dev"
                },
                success: function (data) {
                    native.assistInfoNext(data_ios);
                }
            });
        }

    }

    // 绑定按钮点击事件
    $(".button").on('click', function () {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus_loan").val();
            switch (socialStatus) {
                case 'SI02':
                case 'SI04':
                    button_work();
                    break;
                case 'SI03':
                case 'SI05':
                case 'SI06':
                    button_text();
                    break;
                case 'SI07':
                case 'SI08':
                    button_boss();
                    break;
                default :
                    break;
            }
        }
    })

    //无选择
    //var socialStatus = $("#socialStatus_loan").val();
    //if (socialStatus == "") {
    //    //behave();
    //    $(".button").click(function () {
    //        $("form").validator()
    //    })
    //}
});