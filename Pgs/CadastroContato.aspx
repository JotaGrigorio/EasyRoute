<%@ Page Language="C#" MasterPageFile="../EasyRoute.master" AutoEventWireup="true" CodeBehind="CadastroContato.aspx.cs" Inherits="EasyRoute.Pgs.CadastroContato" %>

<%@ Register Src="~/Uc/UcFormContato.ascx" TagPrefix="uc1" TagName="UcFormContato" %>
<%@ Register Src="~/Uc/UcEnderecosContato.ascx" TagPrefix="uc1" TagName="UcEnderecosContato" %>


<asp:Content ContentPlaceHolderID="content" runat="server">

    <script src="../Js/Contato.js"></script>

    <uc1:UcFormContato runat="server" id="UcFormContato" />

    <script type="text/javascript">
        $("#titulo_form_contato").text("CADASTRO");
        $("#titulo_btn_form_contato").text("CADASTRAR");
    </script>

    <uc1:UcEnderecosContato runat="server" id="UcEnderecosContato" />

</asp:Content>

