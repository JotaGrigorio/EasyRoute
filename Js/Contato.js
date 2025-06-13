$(document).ready(function () {

    urlContato = "/Handlers/Contato.ashx";
    IdEnderecoParam = 0;
    IdContatoParam = ValorParamContexto("id");

    function EventoClick() {

        $("#btn_inserir_contato").click(function () {
            window.location = "CadastroContato.aspx";

        });

        $("#btn_cadastrar_editar_contato").click(function () {
            CadastrarEditarContato(false);
        });

        $("#btn_listar_contatos").click(function () {
            window.location = "ListaContatos.aspx";
        });

        $("#btn_enderecos").click(function () {
            $("#mdlEnderecosContato").modal("show");

            TipoPagina();

            if (IdContatoParam == 0) {
                $(".form").removeClass("inicia-invisivel-form");
                $("#titulo_btn_inserir_endereco").text("INSERIR");
            }

            if (tipoPagina == "Edicao") {
                $(".form").addClass("inicia-invisivel-form");
                $("#divTbEnderecosContato").removeClass("inicia-invisivel-table");
                $("#btn_inserir_novo_endereco").show();
            }

            ListarEnderecosContato(IdContatoParam);
        });

        $("#btn_inserir_endereco").click(function () {
            CadastrarEditarContato(true);
        });

        $("#btn_inserir_novo_endereco").click(function () {
            $("#titulo_btn_inserir_endereco").text("INSERIR");
            $(".form").removeClass("inicia-invisivel-form");
            LimpaCamposEndereco();
            IdEnderecoParam = 0;
        });

        $("#txt_cep").on("keydown", function (e) {
            if (e.keyCode == 13) {
                PesquisarCep();
            }
        });

        $("#btn_pesquisar_cep").click(function () {
            PesquisarCep();
        });
        
    }

    function CadastrarEditarContato(seriaInsercaoEndereco = false) {
        
        TipoPagina();

        // Cadastro - Edição
        if ((tipoPagina != "Edicao" && IdContatoParam > 0 && !seriaInsercaoEndereco) ||
            (tipoPagina == "Edicao" && IdContatoParam > 0 && !seriaInsercaoEndereco)) {
            $("#txt_logradouro").removeClass("field-req");
            $("#txt_numero").removeClass("field-req");
            $("#txt_bairro").removeClass("field-req");
            $("#txt_cep").removeClass("field-req");
            $("#txt_cidade").removeClass("field-req");
            $("#txt_estado").removeClass("field-req");
        }

        if (!CamposRequeridos("field-req", true, "Teste")) {
            MsgAlerta("Preencha os campos obrigatórios");
            return;
        }

        if (!seriaInsercaoEndereco) {
            if (!ValidaCpf($("#txt_cpf").val())) {
                MsgAlerta("CPF inválido");
                $("#txt_cpf").focus();
                return;
            }

            if (!ValidaEmail($("#txt_email").val())) {
                MsgAlerta("Email inválido");
                $("#txt_email").focus();
                return;
            }
        }
        
        var acao = "cadastrar-editar-contato";
        
        const dados = {
            acao: acao,
            contatoId: IdContatoParam,
            enderecoId: IdEnderecoParam,
            nome: $("#txt_nome").val(),
            telefone: $("#txt_telefone").val(),
            cpf: $("#txt_cpf").val(),
            email: $("#txt_email").val(),

            logradouro: $("#txt_logradouro").val(),
            numero: $("#txt_numero").val(),
            bairro: $("#txt_bairro").val(),
            complemento: $("#txt_complemento").val(),
            cep: $("#txt_cep").val(),
            cidade: $("#txt_cidade").val(),
            estado: $("#txt_estado").val(),

            seriaInsercaoEndereco: seriaInsercaoEndereco
        };

        const funcaoSucesso = ret => {

            IdContatoParam = ret.novoContatoId;

            if (ret.sucesso) {

                MsgSucesso();
                $("#divTbEnderecosContato").removeClass("inicia-invisivel-table");

                if (ret.seriaEdicao && tipoPagina == "Edicao" && seriaInsercaoEndereco) {
                    $(".form").addClass("inicia-invisivel-form");
                    LimpaCamposEndereco();
                    ListarEnderecosContato(IdContatoParam);
                }
                else if (ret.seriaEdicao && tipoPagina == "Edicao" && !seriaInsercaoEndereco) {
                    setTimeout(function () {
                        window.location = "ListaContatos.aspx?pagina=1";
                    }, 2000);
                }
                else if (seriaInsercaoEndereco) {
                    window.LimpaCamposEndereco();
                    window.ListarEnderecosContato(ret.novoContatoId);
                }
                else {
                    setTimeout(function () {
                        document.location.reload(true);
                    }, 2000);

                }
            }

            else
                MsgErro(ret.msgRp, acao);

        };

        Post(urlContato, dados, funcaoSucesso);
    }

    function ListarContatos() {
       
        var template = `<tr style="cursor: default">
                           <td>#{Nome}</td>
                           <td>#{Email}</td>
                           <td>#{Telefone}</td>
                           <td>#{Cpf}</td>
                           <td>
                               <div>
                                   <div class="btnlist" onclick="AbrirMdlEnderecosContato(#{Id})" style="cursor: pointer" title="Visualizar endereços"><i class="fa fa-eye" aria-hidden="true"></i>    
                                   </div>
                               </div>
                           </td>
                           <td>
                               <div>
                                   <div class="btnlist" onclick="EditarContato(#{Id})" style="cursor: pointer" title="Editar contato"><i class="fa fa-pencil" aria-hidden="true"></i>    
                                   </div>
                               </div>
                           </td>
                           <td>
                               <div>
                                   <div onclick="ExcluirContato(#{Id})" style="cursor: pointer" title="Excluir contato"><i class="fa fa-trash" aria-hidden="true"></i>    
                                   </div>
                               </div>
                           </td>
                        </tr>
                       `;

        const dados = {};

        PreencheListagem(dados, 10, "Contatos", template, urlContato);
    }

    EventoClick();
    ListarContatos();
    $("#btn_inserir_novo_endereco").hide();

    //Máscaras do formulário
    $("#txt_telefone").mask("(00) 00000-0000");
    $("#txt_cpf").mask("000.000.000-00");
    $("#txt_cep").mask("00000-000");

});

function EditarContato(contatoId) {
    window.location = "EdicaoContato.aspx?id=" + contatoId;
    $("#divTbEnderecosContato").removeClass("inicia-invisivel-table");
    BuscarDadosContato(contatoId);
}

function BuscarDadosContato(contatoId) {

    urlContato = "/Handlers/Contato.ashx";
    var acao = "buscar-dados-contato";

    Get(urlContato, {
        acao,
        contatoId
    },
        function (ret) {

            if (ret.sucesso) {

                IdContatoParam = ret.contatoId;
                
                $("#txt_nome").val(ret.nome);
                $("#txt_telefone").val(ret.telefone);
                $("#txt_cpf").val(ret.cpf);
                $("#txt_email").val(ret.email);

                $("#titulo_form_contato").text("EDIÇÃO");
                $("#titulo_btn_form_contato").text("SALVAR");
                $("#titulo_btn_inserir_endereco").text("SALVAR");

            } else {
                MsgErro(ret.msgRp, acao);
            }
        });
}

function ExcluirContato(contatoId) {
    var acao = "excluir-contato";

    const dados = {
        acao: acao,
        contatoId: contatoId
    };

    const funcaoSucesso = ret => {

        if (ret.sucesso) {
            MsgSucesso();

            setTimeout(function () {
                document.location.reload(true);
            }, 2000);

        }
        else
            MsgErro(ret.msgRp, acao);
    };

    ConfirmarNoty("Tem certeza que deseja excluir este contato?",
        function ($noty) {
            Post(urlContato, dados, funcaoSucesso);
            $noty.close();
        },
        function ($noty) {
            $noty.close();
        });

}

function AbrirMdlEnderecosContato(contatoId) {
    BuscarDadosContato(contatoId);
    $("#mdlEnderecosContato").modal("show");
    $(".form").addClass("inicia-invisivel-form");
    $("#divTbEnderecosContato").removeClass("inicia-invisivel-table");
    ListarEnderecosContato(contatoId);
}

function ListarEnderecosContato(contatoId) {

    var template = `<tr style="cursor: default">
               <td title="#{LogradouroCompleto}">#{Logradouro}</td>
               <td>#{Numero}</td>
               <td title="#{BairroCompleto}">#{Bairro}</td>
               <td title="#{ComplementoCompleto}">#{Complemento}</td>
               <td>#{Cep}</td>
               <td title="#{CidadeCompleto} - #{Estado}">#{Cidade} - #{Estado}</td>
               <td>
                   <div>
                       <div class="btnlist" onclick="EditarEnderecoContato(#{ContatoId},#{EnderecoId})" style="cursor: pointer" title="Editar endereço contato"><i class="fa fa-pencil" aria-hidden="true"></i>    
                       </div>
                   </div>
               </td>
               <td>
                   <div>
                       <div onclick="ExcluirEnderecoContato(#{ContatoId},#{EnderecoId})" style="cursor: pointer" title="Excluir endereço contato"><i class="fa fa-trash" aria-hidden="true"></i>
                       </div>
                   </div>
               </td>
            </tr>`;

    const dados = {
        contatoId: contatoId
    };

    PreencheListagem(dados, 3, "EnderecosContato", template, urlContato);
}

function EditarEnderecoContato(contatoId, enderecoId) {

    urlContato = "/Handlers/Contato.ashx";
    var acao = "buscar-dados-endereco";

    $(".form").removeClass("inicia-invisivel-form");
    $("#titulo_btn_inserir_endereco").text("SALVAR");

    Get(urlContato, {
        acao,
        contatoId,
        enderecoId
    },
        function (ret) {

            if (ret.sucesso) {
                IdEnderecoParam = ret.enderecoId;
                IdContatoParam = ret.contatoId;
                
                $("#txt_logradouro").val(ret.logradouro);
                $("#txt_numero").val(ret.numero);
                $("#txt_bairro").val(ret.bairro);
                $("#txt_complemento").val(ret.complemento);
                $("#txt_cep").val(ret.cep);
                $("#txt_cidade").val(ret.cidade);
                $("#txt_estado").val(ret.estado);

                $("#titulo_form_contato").text("EDIÇÃO");
                $("#titulo_btn_form_contato").text("SALVAR");

            } else {
                MsgErro(ret.msgRp, acao);
            }
        });
}

function ExcluirEnderecoContato(contatoId, enderecoId) {
    var acao = "excluir-endereco-contato";

    const dados = {
        acao: acao,
        contatoId: contatoId,
        enderecoId: enderecoId
    };

    const funcaoSucesso = ret => {

        if (ret.sucesso) {
            MsgSucesso();

            ListarEnderecosContato(ret.contatoId);
        }
        else
            MsgErro(ret.msgRp);
    };

    ConfirmarNoty("Tem certeza que deseja excluir este endereço?",
        function ($noty) {
            Post(urlContato, dados, funcaoSucesso);
            $noty.close();
        },
        function ($noty) {
            $noty.close();
        });

}

function LimpaCamposEndereco() {
    $("#txt_logradouro").val("");
    $("#txt_numero").val("");
    $("#txt_bairro").val("");
    $("#txt_complemento").val("");
    $("#txt_cep").val("");
    $("#txt_cidade").val("");
    $("#txt_estado").val("");
}


