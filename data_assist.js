$(function () {
    // 字典初始化完成回调函数
    var url_demo = window.location.href;
    var arr_d = url_demo.split("?");
    var reg = new RegExp("=", "g");
    var reg1 = new RegExp("&", "g");
    var reg2 = new RegExp("-", "g");
    var reg3 = new RegExp(" ", "g");
    var abc = "[{" + arr_d[1].replace(reg2, "").replace(reg, ":'").replace(reg1, "',") + "'}]";
    var data_info = eval("(" + abc + ")");

    //var title = undefined;

    uniqueId = data_info[0].uniqueId;
    UserId = data_info[0].userId;
    appNo = data_info[0].applyNo;
    MobilePhone = data_info[0].mobilePhone;
    Application = data_info[0].XApplicationId;
    Version = data_info[0].XAPIVersion;
    Client = data_info[0].XClient;
    Token = data_info[0].XToken;
    productCode = data_info[0].type;
    $(".steps").removeClass("diso_s");
    $(".button").text("下一步");
    if (productCode == "1") {
        $(".sp_d_header1").addClass("diso_s");
        title = {"title": ["基本信息", "辅助信息", "攒信用", "人脸识别", "上传资料"], "index": 2}
    } else if (productCode == "2") {
        $(".sp_d_header2").addClass("diso_s");
        title = {"title": ["基本信息", "辅助信息", "人脸识别", "上传资料"], "index": 2}
    } else if (productCode == "3") {
        $(".sp_d_header3").addClass("diso_s");
        if (window.NEW_PROCESS) {
            title = {"title": ["基本信息", "辅助信息", "人脸识别", "授信", "上传资料"], "index": 2}
        } else {
            title = {"title": ["基本信息", "辅助信息", "人脸识别", "上传资料", "授信"], "index": 2}
        }
    } else if (productCode == "4") {
        $(".sp_d_header4").addClass("diso_s");
        title = {"title": ["基本信息", "辅助信息", "上传资料"], "index": 2}
    } else if (productCode == "0") {
        $(".button").text("保存");
        title = {"title": [], "index": 2}
    }
    $("#familyMaritalStatus").change(function () {
        if ($(this).val() == "20") {
            $("#allRelation").html("<option value='RF01' selected>配偶</option>");
            $("#allRelation").val("RF01").trigger('change');
            $(".allRelation").text("配偶");
            $(".allRelation").css("color", "rgb(169, 169, 169)");
            $("#allRelation").css("display", "none");
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
    window.add = function(data_json) {
        var aaa = JSON.parse(data_json);
        sessionStorage.setItem("json_none", JSON.stringify(aaa));
    }

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
    $("#begin_school").click(function () {
        var myDate = new Date();
        //获取当前年
        var year = myDate.getFullYear() - 8;
        var param = {format: 'yyyy-MM'};
        param.min = year;
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
        }else if (str_id == "begin_rork") {
            $("#begin_rork").val(string_val);
        }else if(str_id == "begin_school") {
             $("#begin_school").val(string_val);
        }
    }


    var data_string_url = urlapi + "/msjrapi/customer/cust_info";
    Dictionary.load();
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
                //公共的联系人信息拉去
                if (data.other_info.contacts.length == 1 && data.other_info.contacts[0].relationship == "R005") {
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                }
                if (data.other_info.contacts.length == 2) {
                    $("#allRelation").val(data.other_info.contacts[0].relationship).trigger('change');
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    $(".next_cilck").before("<div class='item_other' id='list_1'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>1</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' class='name_all1'  maxlength='15'/></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' maxlength='11' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' /></div><span></span></li></div>");
                    Dictionary.load($("#list_1").find("select"), function () {
                    });
                    $("#list_1").find("select.allRelation1").val(data.other_info.contacts[1].relationship).trigger('change');
                    $("#list_1").find(".pho_mobile1").val(data.other_info.contacts[1].phone_number);
                    $("#list_1").find(".name_all1").val(data.other_info.contacts[1].name);
                }
                if (data.other_info.contacts.length == 3) {
                    $("#allRelation").val(data.other_info.contacts[0].relationship).trigger('change');
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    $(".next_cilck").before("<div class='item_other' id='list_1'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>1</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' class='name_all1' maxlength='15' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' maxlength='11' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' /></div><span></span></li></div><div class='item_other' id='list_2'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>2</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' maxlength='15' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' maxlength='11' class='pho_mobile1' /></div><span></span></li></div>");
                    Dictionary.load($("#list_1").find("select"), function () {
                    });
                    Dictionary.load($("#list_2").find("select"), function () {
                    });
                    $("#list_1").find("select.allRelation1").val(data.other_info.contacts[1].relationship).trigger('change');
                    $("#list_1").find(".pho_mobile1").val(data.other_info.contacts[1].phone_number);
                    $("#list_1").find(".name_all1").val(data.other_info.contacts[1].name);
                    $("#list_2").find("select.allRelation1").val(data.other_info.contacts[2].relationship).trigger('change');
                    $("#list_2").find(".pho_mobile1").val(data.other_info.contacts[2].phone_number);
                    $("#list_2").find(".name_all1").val(data.other_info.contacts[2].name);
                }
                if (data.other_info.contacts.length >= 4) {
                    $("#allRelation").val(data.other_info.contacts[0].relationship).trigger('change');
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    $(".next_cilck").before("<div class='item_other' id='list_1'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>1</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' class='name_all1'  maxlength='15' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' maxlength='11'/></div><span></span></li></div><div class='item_other' id='list_2'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>2</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' maxlength='15'  placeholder='请输入联系人姓名' data-rule='required name_self' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value=''data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile'maxlength='11' class='pho_mobile1' maxlength='11'/></div><span></span></li></div><div class='item_other' id='list_3'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>3</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' placeholder='请输入联系人姓名' data-rule='required name_self' maxlength='15' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1'maxlength='11' /></div><span></span></li></div>");
                    Dictionary.load($("#list_1").find("select"), function () {
                    });
                    Dictionary.load($("#list_2").find("select"), function () {
                    });
                    Dictionary.load($("#list_3").find("select"), function () {
                    });
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
                if (typeof(data.other_info.social_statuses) != 'undefined') {
                    $(".worker").css("display", "none");
                    $(".data_choose").each(function() {
                        var rule = $(this).data('rule');
                        if (rule) {
                            $(this).data('defaultRule', rule);
                        }
                        $(this).data("rule", "");
                    });
                    $(".button").unbind('click');
                    $("#socialStatus").val(data.other_info.social_statuses).trigger('change');
                    $(".pho_mobile").val(data.other_info.contacts[0].phone_number);
                    $(".name_all").val(data.other_info.contacts[0].name);
                    if (typeof(data.other_info.contacts[0].address) != 'undefined') {
                        $(".address_all").val(data.other_info.contacts[0].address);
                    }
                    if (data_social == "SI01") { //学生信息--数据拉去---数据提交
                        $(".item-content.bottom_line").removeClass("add_line");
                        $(".unemployed, .personality, .boss_work_time").css("display", "none");
                        $(".shool").css("display", "block");

                        $(".shool").find(".data_choose").each(function() {
                            $(this).data("rule", $(this).data('defaultRule') || "required");
                        });
                        $(".boss_work_list").css("display", "block");
                        $(".boss_work_list").find("#education").attr("data-rule", "required");
                        $("#education").val($.empty2def(data.other_info.edu_backgrounds)).trigger('change');
                        $(".shouru_q").val($.empty2def(data.other_info.salary_amount));
                        $(".shouru_t").val($.empty2def(data.other_info.other_income_amount));
                        $(".shouru_k").val($.empty2def(data.other_info.other_loan_amount));
                        $(".school_name").val($.empty2def(data.other_info.student.school_name));
                        $(".begin_school").val($.empty2def(data.other_info.student.time_of_enrollment));
                        $("#schoolsystem").val($.empty2def(data.other_info.student.school_system)).trigger('change');
                        $(".button").unbind("click").click(function () {
                            button_school();
                        })
                    }
                    if (data_social == "SI02" || data_social == "SI04") {//在职--数据拉去---数据提交
                        $(".item-content.bottom_line").removeClass("add_line");
                        $(".boss_work_list").css("display", "block");

                        $(".unemployed").find('.color_b').css('display', 'none');

                        $(".list-block  .item-content").removeClass(".bottom_line")


                        $(".boss_work_list").find("#education").attr("data-rule", "required");
                        $(".region-item").css("display", "block");
                        $(".unemployed, .personality, .boss_work_time").css("display", "block");
                        $(".unemployed, .personality, .boss_work_time").find(".data_choose").each(function() {
                            $(this).data("rule", $(this).data('defaultRule') || "required");
                        });
                        $("#education").val($.empty2def(data.other_info.edu_backgrounds)).trigger('change');
                        $(".shouru_q").val($.empty2def(data.other_info.salary_amount));
                        $(".shouru_t").val($.empty2def(data.other_info.other_income_amount));
                        $(".shouru_k").val($.empty2def(data.other_info.other_loan_amount));
                        $(".work_a").val($.empty2def(data.other_info.worker.name));
                        $(".begin_time").val($.empty2def(data.other_info.worker.date_to_work));
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
                        $(".begin_rork").val(data.other_info.worker.employment_date)
                        $(".button").unbind("click").click(function () {
                            button_work();
                        })
                    }
                    if (data_social == "SI03" || data_social == "SI05" || data_social == "SI06") {//无业--数据拉去---数据提交
                        $(".item-content.bottom_line").removeClass("add_line");
                        $(".boss_work_list").css("display", "block");
                        $(".boss_work_list").find("#education").attr("data-rule", "required");
                        $("#education").val($.empty2def(data.other_info.edu_backgrounds)).trigger('change');
                        $(".shouru_q").val($.empty2def(data.other_info.salary_amount));
                        $(".shouru_t").val($.empty2def(data.other_info.other_income_amount));
                        $(".shouru_k").val($.empty2def(data.other_info.other_loan_amount));
                        $(".personality").css("display", "block");
                        $(".personality").find(".data_choose").each(function() {
                            $(this).data("rule", $(this).data('defaultRule') || "required");
                        });
                        $(".button").unbind("click").click(function () {
                            button_text();
                        })
                    }
                    if (data_social == "SI07" || data_social == "SI08") {     //个体--数据拉去---数据提交
                        $(".item-content.bottom_line").addClass("add_line");
                        $(".boss_work_list").find("#education").attr("data-rule", "");
                        $(".boss_work_list").css("display", "block");    //教育
                        $(".unemployed").css("display", "block");
                        $('.unemployed').find('#position_job').css('display', 'block');

                        $(".boss_work").css("display", "block");
                        $(".personality").css("display", "block");
                        $(".boss_work").find(".data_choose").each(function() {
                            $(this).data("rule", $(this).data('defaultRule') || "required");
                        });
                        $(".boss_work_time").css("display", "block");
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
                        $(".button").unbind("click").click(function () {
                            button_boss();
                        })
                    }
                }
            }
        }
    });
    /*新增联系人添加*/
    var num = 0;
    $(".next_cilck").unbind('click').click(function () {
        num++;
        $(this).before("<div class='item_other' id='list_" + num + "'><li class='item-content bor_top'><div class='item-title color_b'>其他联系人<span class='qwert'>" + num + "</span></div><strong class='delete_clear'></strong></li><li class='item-content point'><div class='item-title'>关系</div><div class='item-input'><span class='select_title allRelation1'>请选择与申请人关系</span><select name='allRelation' class='allRelation1' data-rule='required' data-rule-required='请选择与申请人关系' data-dictionary='allRelation'><option value=''>请选择与申请人关系</option></select></div></li><li class='item-content'><div class='item-title'>姓名</div><div class='item-input'><input type='text' value='' maxlength='15' placeholder='请输入联系人姓名' data-rule='required name_self' data-rule-msg='姓名：请输入2到20个汉字' class='name_all1' /></div></li><li class='item-content phone_bt phone_click1'><div class='item-title'>手机号</div><div class='item-input'><input type='tel' value='' maxlength='11' data-rule-msg=' 请填写正确的联系人手机号码' data-rule-required='请填写联系人手机号码' placeholder='请输入正确的联系人手机号' data-rule='required mobile' class='pho_mobile1' /></div><span></span></li></div>");
        Dictionary.load($("#list_" + num).find("select"), function () {
        });
        if (num == 3) {
            $(".next_cilck").hide();
        } else {
            $(".next_cilck").show();
        }
    })
    /*新增联系人删除*/
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
    /*通讯录拉去*/
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
//社会身份选择不同字段判断
    $("#socialStatus").on('change', function () {
        console.log(1111);
        $(".unemployed, .personality, .boss_work_time, .school").css("display", "none");
        $(".data_choose").each(function() {
            var rule = $(this).data('rule');
            if (rule) {
                $(this).data('defaultRule', rule);
            }
            $(this).data("rule", "");
        });
        $(".button").unbind('click');
        if ($(this).val() == "") {
            $(".button").unbind("click").click(function () {
                button_work();
            })
        }
        if ($(this).val() == "SI01") {
            $(".item-content.bottom_line").removeClass("add_line")
            $(".boss_work_list").css("display", "block");

            $(".item-content.bottom_line").css("border-bottom", "#E1E1E1 1px solid")
            $(".boss_work_list").find("#education").attr("data-rule", "required");
            $(".school, .personality").css("display", "block");
            $(".school, .personality").find(".data_choose").each(function() {
                $(this).data("rule", $(this).data('defaultRule') || "required");
            });
            $(".button").unbind("click").click(function () {
                console.log('学生');
                button_school();
            })
        }
        if ($(this).val() == "SI02" || $(this).val() == "SI04") {
            $(".item-content.bottom_line").removeClass("add_line")
            $(".item-content.bottom_line").css("border-bottom", "#E1E1E1 1px solid")
            $(".boss_work_list").css("display", "block");

            $(".unemployed").find('.remove_job').remove();

            $(".boss_work_list").find('#position_job').removeAttr('data-rule').parent().parent().css('display','none');
            //$(".boss_work_list").find('.position_job').parent().parent().remove();

            $(".boss_work_list").find("#education").attr("data-rule", "required");
            $(".unemployed, .personality").css("display", "block");
            $(".boss_work_time").css("display", "block");
            $(".unemployed, .personality, .begin_works").css("display", "block");
            $(".boss_work_time, .unemployed, .personality").find(".data_choose").each(function() {
                $(this).data("rule", $(this).data('defaultRule') || "required");
            });

            $(".button").unbind("click").click(function () {
                button_work();
            })
        }
        if ($(this).val() == "SI03" || $(this).val() == "SI05" || $(this).val() == "SI06") {
            $(".item-content.bottom_line").removeClass("add_line")
            $(".boss_work_list").css("display", "block");

            $(".boss_work_list").find('#position_job').removeAttr('data-rule').parent().parent().css('display','none');

            $(".item-content.bottom_line").css("border-bottom", "#E1E1E1 1px solid")
            $(".boss_work_list").find("#education").attr("data-rule", "required");
            $(".personality").css("display", "block");
            $(".personality").find(".data_choose").each(function() {
                $(this).data("rule", $(this).data('defaultRule') || "required");
            });
            $(".button").unbind("click").click(function () {
                console.log('无业');
                button_text();
            })
        }
        if ($(this).val() == "SI07" || $(this).val() == "SI08") {
            $(".item-content.bottom_line").addClass("add_line")
           /* $(".boss_work_list").css("display", "none");
            $(".boss_work_list").find("#education").attr("data-rule", "");*/
            //$(".unemployed").css("display", "block");
            $("#position_job").parent().parent().parent().css('display','block');   //职位信息
            $(".boss_work_list").css("display", "block");
            $(".boss_work_list").find("#education").attr("data-rule", "required");

            $('.unemployed').css('display', 'block');
            $('.unemployed').find('#position_job').css('display', 'block');
            $(".boss_work_list").find('#position_job').attr('data-rule','required').parent().parent().css('display','block');

            $(".unemployed").find('.begin_works').css('display','none');
            $(".boss_work").css("display", "block");
            $(".personality").css('display','block');
            $(".boss_work").find(".data_choose").each(function() {
                $(this).data("rule", $(this).data('defaultRule') || "required");
            });
            $(".boss_work_time").css("display", "none");
            $(".boss_work_time").find(".data_choose").attr("data-rule", "");
            $(".button").unbind("click").click(function () {
                button_boss();
            })
        }
    })
//社会身份——------学生
    function button_school() {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus").val();
            var education = $("#education").val();
            var shouru_q = $(".shouru_q").val();
            var shouru_t = $(".shouru_t").val();
            var shouru_k = $(".shouru_k").val();
            var school_name = $(".school_name").val();
            var begin_school = $(".begin_school").val();
            var schoolsystem = $("#schoolsystem").val();
            var familyMaritalStatus = $("#familyMaritalStatus").val();
            var allRelation = $("#allRelation").val();
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
            }
            if (name2 != undefined && name2 != null && name2 != "") {
                contacts.push({'relationship': relation2, 'name': name2, 'phone_number': pho_num2});
            }
            if (name3 != undefined && name3 != null && name3 != "") {
                contacts.push({'relationship': relation3, 'name': name3, 'phone_number': pho_num3});
            }
            data_ios = {
                "apply_no": appNo,
                'social_statuses': socialStatus,
                'edu_backgrounds': education,
                'salary_amount': shouru_q,
                'other_income_amount': shouru_t,
                'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus,
                'top_info': title,
                "student": {
                    'school_name': school_name,
                    'time_of_enrollment': begin_school,
                    'school_system': schoolsystem
                },
                "contacts": contacts
            }
            data = {
                "apply_no": appNo,
                'social_statuses': socialStatus,
                'edu_backgrounds': education,
                'salary_amount': shouru_q,
                'other_income_amount': shouru_t,
                'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus,
                "student": {
                    'school_name': school_name,
                    'time_of_enrollment': begin_school,
                    'school_system': schoolsystem
                },
                "contacts": contacts
            }
            var url_other = urlapi + "/msjrapi/customer/submit/other_info";
            if (school_name.length < 4) {
                $.warn("请输入学校名称");
                return;
            }
            if (detail_address.length < 4) {
                $.warn("请填写正确的联系地址");
                return;
            } else {
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
                })
            }
        }
    }

    //社会身份 -------在职人员、企业负责人
    function button_work() {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus").val();
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
            var employment_date = $(".begin_rork").val();  //入职时间
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
            }
            if (name2 != undefined && name2 != null && name2 != "") {
                contacts.push({'relationship': relation2, 'name': name2, 'phone_number': pho_num2});
            }
            if (name3 != undefined && name3 != null && name3 != "") {
                contacts.push({'relationship': relation3, 'name': name3, 'phone_number': pho_num3});
            }
            data_ios = {
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
            data = {
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
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = (month < 10 ? "0" + month : month);
            var mydate = (year.toString() + month.toString());
            if (date_to_work.replace(reg_time, "") - mydate > 0) {
                $.warn("请选择正确参加工作日期");
                return;
            }
            if (pho_work != "" && pho_work[0] != "0" || pho_work != "" && pho_work.length < 9) {
                $.warn("请填写区号+座机号");
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
                })
            }

        }
    }

//个体工商户、个体经营者
    function button_boss() {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus").val();
            var education = $("#education").val();
            var shouru_q = $(".shouru_q").val();
            var shouru_t = $(".shouru_t").val();
            var shouru_k = $(".shouru_k").val();

            var position_job = $('#position_job').val(); //职位

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
            }
            if (name2 != undefined && name2 != null && name2 != "") {
                contacts.push({'relationship': relation2, 'name': name2, 'phone_number': pho_num2});
            }
            if (name3 != undefined && name3 != null && name3 != "") {
                contacts.push({'relationship': relation3, 'name': name3, 'phone_number': pho_num3});
            }
            data_ios = {
               // "apply_no": appNo, 'social_statuses': socialStatus,
                'salary_amount': shouru_q,
                'other_income_amount': shouru_t,
                'other_loan_amount': shouru_k,
                "apply_no": appNo,
                'social_statuses': socialStatus,
                'edu_backgrounds': education,
                'position_job': position_job,  //职位
                'marital_status': familyMaritalStatus,
                'top_info': title,
                "worker": {
                    'name': work_a,
                    'telephone': pho_work,
                    'extension': run_number,
                    'province_code': province_code,
                    'city_code': city_code,
                    'zone_code': distinct_code,
                    'detail': detail
                }, "contacts": contacts
            }
            data = {
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
                })
            }
        }
    }

//社会身份------自由职业、无业、退休
    function button_text() {
        if ($("form").validator()) {
            var socialStatus = $("#socialStatus").val();
            var education = $("#education").val();
            var shouru_q = $(".shouru_q").val();
            var shouru_t = $(".shouru_t").val();
            var shouru_k = $(".shouru_k").val();
            var allRelation = $("#allRelation").val();
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
            }
            if (name2 != undefined && name2 != null && name2 != "") {
                contacts.push({'relationship': relation2, 'name': name2, 'phone_number': pho_num2});
            }
            if (name3 != undefined && name3 != null && name3 != "") {
                contacts.push({'relationship': relation3, 'name': name3, 'phone_number': pho_num3});
            }
            data_ios = {
                "apply_no": appNo, 'social_statuses': socialStatus, 'edu_backgrounds': education,
                'salary_amount': shouru_q, 'other_income_amount': shouru_t, 'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus,
                "contacts": contacts,
                'top_info': title
            }
            data = {
                "apply_no": appNo, 'social_statuses': socialStatus, 'edu_backgrounds': education,
                'salary_amount': shouru_q, 'other_income_amount': shouru_t, 'other_loan_amount': shouru_k,
                'marital_status': familyMaritalStatus,
                "contacts": contacts
            }

            //urlapi = https://msjrapi.msxf.com
            var url_other = urlapi + "/msjrapi/customer/submit/other_info";
            if (detail_address.length < 4) {
                $.warn("请输入3-60位汉字+数字或字母或字符且以汉字开头");
                return;
            } else {
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
                })
            }
        }
    }

    //无选择
    var socialStatus = $("#socialStatus").val();
    if (socialStatus == "") {
        $(".button").click(function () {
            $("form").validator()
        })
    }
});