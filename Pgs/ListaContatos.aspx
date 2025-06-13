<%@ Page Language="C#" MasterPageFile="../EasyRoute.master" AutoEventWireup="true" CodeBehind="ListaContatos.aspx.cs" Inherits="EasyRoute.Pgs.ListaContatos" %>
<%@ Register Src="~/Uc/UcEnderecosContato.ascx" TagPrefix="uc1" TagName="UcEnderecosContato" %>

<asp:Content ContentPlaceHolderID="content" runat="server">
    <script src="../Js/Contato.js"></script>

    <div class="container-listagem">
        <div class="mt-4">
            <h3>CONTATOS</h3>
        </div>

        <div class="mb-2">
            <button type="button" class="btn btn-primary" id="btn_inserir_contato">
                <i class="fa fa-plus" title="Inserir novo contato"></i>
            </button>
        </div>

        <div class="row">
            <div class="col-lg-12 m-top-sm">
                <div id="divTbContatos" style="min-height: 410px;">
                    <table id="tbContatos" class="table table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th style="width: 23%;">Nome</th>
                                <th style="width: 23%;">Email</th>
                                <th style="width: 14%;">Telefone</th>
                                <th style="width: 14%;">CPF</th>
                                <th style="width: 10%;">Endereços</th>
                                <th style="width: 8%;">Editar</th>
                                <th style="width: 8%;">Excluir</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="pgContatos" class="paginacao"></div>
    </div>

    <uc1:UcEnderecosContato runat="server" id="UcEnderecosContato" />

</asp:Content>
