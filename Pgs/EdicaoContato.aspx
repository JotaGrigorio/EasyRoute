<%@ Page Language="C#" MasterPageFile="../EasyRoute.master" AutoEventWireup="true" CodeBehind="EdicaoContato.aspx.cs" Inherits="EasyRoute.Pgs.EdicaoContato" %>

<%@ Register Src="~/Uc/UcFormContato.ascx" TagPrefix="uc1" TagName="UcFormContato" %>
<%@ Register Src="~/Uc/UcEnderecosContato.ascx" TagPrefix="uc1" TagName="UcEnderecosContato" %>


<asp:Content ContentPlaceHolderID="content" runat="server">

    <script src="../Js/Contato.js"></script>

    <script type="text/javascript">
        var IdContatoParam = ValorParamContexto("id");
        BuscarDadosContato(IdContatoParam);
    </script>

    <uc1:UcFormContato runat="server" ID="UcFormContato" />
    <uc1:UcEnderecosContato runat="server" ID="UcEnderecosContato" />

</asp:Content>
