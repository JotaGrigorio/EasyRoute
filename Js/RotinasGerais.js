function Post(url, data, success) {
    $.ajax({ url: url, data: data, dataType: "JSON", type: "POST", success: success, cache: false });
};

function Get(url, data, success) {

    $.ajax({ url: url, data: data, dataType: "JSON", success: success, cache: false });
};

function PreencheListagem(objAjax, regsPorPag, nomeListagem, paramTemplate, url) {

    // Remove indentação do template HTML
    const trimIndent = texto => texto.split('\n').map(s => s.trim()).join('');
    const template = trimIndent(paramTemplate);

    // Monta nomes de elementos com base em 'nomeListagem'
    var tb = "tb" + nomeListagem,
        tmp = "tmp" + nomeListagem,
        pg = "pg" + nomeListagem;

    // Referências aos elementos da tabela
    var corpoTb = $("#" + tb + " tbody");
    var headerTb = $("#" + tb + " thead");
    var totalTh = $("#" + tb).children("thead").children("tr").children("th.th-geral").length;

    // Template de linha sem registros
    var templateSemRegistro = '<tr>';
    for (var i = 0; i < totalTh; i++) {
        templateSemRegistro += '<td>-</td>';
    }
    templateSemRegistro += "</tr>";
    corpoTb.html(templateSemRegistro);

    // Registra o template para uso com $.tmpl
    $.template("tmp{0}".format(nomeListagem), template.replace(/#{/g, "${"));

    var htmlHeader = objAjax.header;
    var pgAtual = 1;

    // Ajusta dados para envio
    objAjax.acao = "Lista-" + nomeListagem;
    objAjax.tome = regsPorPag;
    objAjax.deixe = 0;

    // Chamada AJAX para preencher tabela
    Get(url, objAjax, function (ret) {
        var sucesso = ret.sucesso;

        if (isNaN(ret.cnt)) ret.cnt = 0;
        if (isNaN(sucesso)) sucesso = true;

        if ((ret.cnt === 0) || (!sucesso) || (ret.lista == undefined)) {
            corpoTb.html(templateSemRegistro);
        } else {
            if (htmlHeader) headerTb.html(htmlHeader);
            corpoTb.html($.tmpl(tmp, ret.lista));
        }

        // Paginação com smartpaginator
        if (ret.cnt <= regsPorPag) {
            $("#" + pg).hide();
        } else {
            $("#" + pg).show().smartpaginator({
                totalrecords: parseInt(ret.cnt),
                recordsperpage: regsPorPag,
                datacontainer: tb,
                initval: pgAtual,
                onchange: function (index) {
                    $("html, body").scrollTop(0);
                    objAjax.deixe = regsPorPag * (index > 0 ? index - 1 : 0);

                    // Atualiza dados da página
                    Get(url, objAjax, function (ret2) {
                        corpoTb.html($.tmpl(tmp, ret2.lista));
                        $("#" + pg).show();
                    });
                }
            });
        }
    });
}

function TipoPagina() {

    // Extrai parte final da URL atual
    var urlPagina = window.location.href;
    var indexUltimaBarra = urlPagina.lastIndexOf("/");

    if (indexUltimaBarra > 0 && urlPagina.length - 1 != indexUltimaBarra) {
        var url = urlPagina.substring(indexUltimaBarra + 1);
        tipoPagina = url.substr(0, 6);
    }
    else
        return 0;
}

// Mensagens
function Alerta(msg, paramTipo) {

    // Exibe mensagem de alerta do tipo informado (success, warning, danger) do bootstrap.
    var tipo = paramTipo.toLowerCase(),
        id = "msg-sistema-{0}".format(tipo);

    // Cria container da mensagem no topo da tela
    $("body").append('<div style=" width: 100%; text-align: center; margin: 0; position: fixed; top: 45px; left: 0px; right: 0px; z-index: 99999;" id="{0}"></div>'.format(id));
    id = "#" + id;

    // Monta HTML da mensagem
    $(id).html(('<br /><div class="alert alert-{1} alert-dismissible" role="alert"></button>' +
        '<div id="txtErro"> {0} </div></div>').format(msg, tipo));

    // Oculta após 4 segundos
    setTimeout(function () {
        $(id).slideUp().remove();
    }, 4000);

}

function MsgSucesso(msg) {

    if (!msg)
        msg = "Operação realizada com sucesso";

    Alerta(msg, "success");
}

function MsgAlerta(msg) {
    Alerta("<b>" + msg + "</b>", "warning");
}

function MsgErro(msg, acao) {
    var classeErro = "danger";

    if (acao) {
        Alerta("Ocorreu um erro.", classeErro);
    } else {
        Alerta(msg, classeErro);
    }
}

// Campos Requeridos
function CamposRequeridos(classe) {
    var ok = true;

    if (classe == undefined || typeof classe != "string") {
        classe = "field-req";
    }

    // Verifica cada campo com a classe informada
    $(".{0}".format(classe)).each(function (ind, inp) {
        if (!CampoRequerido(inp.id, classe))
            ok = false;
    });

    if (!ok)
        MsgErro("Preencha os campos obrigatórios");

    return ok;
}

function CampoRequerido(idInput, classe) {
    var input = $("#" + idInput);

    if (
        ((!input.val()) ||
            (input.val() == undefined) ||
            (input.hasClass("field-decimal") && (ToDecimal(input.val()) <= 0)) ||
            (input.hasClass("field-int") && (parseInt(input.val()) <= 0)) ||
            (input.hasClass("field-enum") && (parseInt(input.val()) <= 0)) ||
            (input.hasClass("field-int-rh") && (parseInt(input.val()) < 0)) ||
            (input.hasClass(classe) && (parseInt(input.val()) <= 0))
        )
        && (input.is(":visible"))
        && ((!classe) || input.hasClass(classe))
    ) {
        input.css("border", "solid 1px #9400d3");
        return false;
    }
    else {
        input.css("border", "1px solid #d5d5d5");
        return true;
    }

}

function RetiraMascara(paramValor) {

    if (!paramValor)
        return "";

    var exp = /\-|\.|\/|\(|\)| /g;
    return paramValor.toString().replace(exp, "");
}

// Validações
function ValidaCpf(cpf) {
    cpf = RetiraMascara(cpf);

    if (cpf.length !== 11)
        return false;
    if (["00000000000", "11111111111", "22222222222", "33333333333", "44444444444", "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"].indexOf(cpf) !== -1)
        return false;

    var soma = 0,
        i, rev;

    for (i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    rev = 11 - (soma % 11);

    if (rev === 10 || rev === 11) {
        rev = 0;
    }

    if (rev !== parseInt(cpf.charAt(9))) {
        return false;
    }

    soma = 0;

    for (i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    rev = 11 - (soma % 11);

    if (rev === 10 || rev === 11)
        rev = 0;

    if (rev !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
};

function ValidaEmail(paramEmail) {
    if (!paramEmail)
        return true;

    paramEmail = paramEmail.toLowerCase();

    if (/[áàâãªéèêíìîóòôõº°úùûüç&=+^?<>!#$%:;]/.test(paramEmail))
        return false;

    var procurandoArroba = paramEmail.match(/@/g);

    if (procurandoArroba && procurandoArroba.length !== 1)
        return false;

    if ((paramEmail.indexOf("[") !== -1) ||
        (paramEmail.indexOf("]") !== -1) ||
        (paramEmail.indexOf("(") !== -1) ||
        (paramEmail.indexOf(")") !== -1) ||
        (paramEmail.indexOf("{") !== -1) ||
        (paramEmail.indexOf("}") !== -1) ||
        (paramEmail.indexOf("/") !== -1) ||
        (paramEmail.indexOf("\\") !== -1) ||
        (paramEmail.indexOf("|") !== -1))
        return false;

    var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;;
    return regex.test(paramEmail);

}

function ConfirmarNoty(texto, callbackConfirma, callbackCancelar, botaoConfirma, botaoCancelar) {

    botaoConfirma = botaoConfirma === undefined ? "Sim" : botaoConfirma;
    botaoCancelar = botaoCancelar === undefined ? "Não" : botaoCancelar;

    noty({
        layout: 'center',
        text: texto,
        modal: true,
        maxVisible: 1,
        closeWith: ['button'],
        animation: {
            open: { height: "toggle" },
            close: { height: "toggle" },
            easing: "swing",
            speed: 0
        },
        buttons: [{
            addClass: 'btn btn-danger',
            text: botaoCancelar,
            onClick: typeof callbackCancelar == "function" ? callbackCancelar :
                function ($noty) {
                    $noty.close();
                }
        }, {
            addClass: 'btn btn-blue',
            text: botaoConfirma,
            onClick: typeof callbackConfirma == "function" ? callbackConfirma :
                function ($noty) {
                    $noty.close();
                }
        }]
    });
}

// Auxiliares
// String.Format
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

// Retorna o valor de um parâmetro específico da URL
function ValorParamContexto(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) || "";
}

// Pesquisa ViaCep
function PesquisarCep() {

    if (!CamposRequeridos("field-req-cep", true)) {
        MsgAlerta("Preencha os campos obrigatórios");
        return;
    }

    urlContato = "/Handlers/Contato.ashx";
    var acao = "pesquisar-cep";

    Get(urlContato, {
        acao,
        cep: $("#txt_cep").val()
    },
        function (ret) {

            if (ret.sucesso) {

                if (ret.erro) {
                    MsgAlerta("CEP não encontrado!");
                    $("#txt_logradouro").val("");
                    $("#txt_bairro").val("");
                    $("#txt_complemento").val("");
                    $("#txt_cidade").val("");
                    $("#txt_estado").val("");
                } else {
                    $("#txt_logradouro").val(ret.logradouro);
                    $("#txt_bairro").val(ret.bairro);
                    $("#txt_complemento").val(ret.complemento);
                    $("#txt_cidade").val(ret.cidade);
                    $("#txt_estado").val(ret.estado);
                    $("#txt_numero").focus();
                }

            } else {
                MsgErro(ret.msgRp, acao);
            }
        });
}