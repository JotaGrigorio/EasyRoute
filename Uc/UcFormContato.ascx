<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="UcFormContato.ascx.cs" Inherits="EasyRoute.Pgs.UcFormContato" %>

<div class="wrapper-form">
    <div class="form-body">
        <div class="mb-5">
            <h3><span id="titulo_form_contato"></span></h3>
        </div>

        <div class="form-horizontal">
            <div class="form-group mb-2">
                <div class="row">
                    <label class="form-label col-md-2">Nome</label>
                    <div class="col-md-10">
                        <input type="text" id="txt_nome" class="form-control field-req" placeholder="Digite o nome" maxlength="200" />
                    </div>
                </div>
            </div>

            <div class="form-group mb-2">
                <div class="row">
                    <label class="form-label col-md-2">Telefone</label>
                    <div class="col-md-10">
                        <input type="text" id="txt_telefone" class="form-control field-req" placeholder="(00) 00000-0000" maxlength="22" />
                    </div>
                </div>
            </div>

            <div class="form-group mb-2">
                <div class="row">
                    <label class="form-label col-md-2">CPF</label>
                    <div class="col-md-10">
                        <input type="text" id="txt_cpf" class="form-control field-req" placeholder="000.000.000-00" maxlength="20" />
                    </div>
                </div>
            </div>

            <div class="form-group mb-2">
                <div class="row">
                    <label class="form-label col-md-2">Email</label>
                    <div class="col-md-10">
                        <input type="text" id="txt_email" class="form-control field-req" placeholder="Digite o email" maxlength="200" />
                    </div>
                </div>
            </div>

            <div class="form-group mb-3">
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-9">
                        <button type="button" class="btn btn-primary" id="btn_enderecos" title="Inserir endereços">
                            ENDEREÇOS&nbsp
                        <i class="fa fa-address-book"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-3">
                <button type="button" id="btn_cadastrar_editar_contato" class="btn btn-success pull-right">
                    <span id="titulo_btn_form_contato"></span>
                </button>
            </div>
        </div>
    </div>
</div>
