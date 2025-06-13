using Notfy_LinqToSql.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Notfy_LinqToSql.Handlers
{
   
    public class Notificacao : IHttpHandler
    {

        private readonly NotfyDataContext db = new NotfyDataContext();

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";

            if (context.Request["acao"] == null)
                return;

            var acao = context.Request["acao"].ToLower();

            switch (acao)
            {
                case "cadastrar-editar-notificacao":
                    {
                        try
                        {
                            var notificacaoID = context.Request["notificacaoID"];
                            var notificadorID = context.Request["notificadorID"];
                            var notificandoID = context.Request["notificandoID"];
                            var enderecoID = context.Request["enderecoID"];
                            var matricula = context.Request["matricula"];
                            var observacoes = context.Request["observacoes"];

                            if (!string.IsNullOrEmpty(notificacaoID))
                            {
                                var notificacaoInfo = db.Notificacaos.SingleOrDefault(o => o.ID == int.Parse(notificacaoID));

                                notificacaoInfo.NotificadorID = int.Parse(notificadorID);
                                notificacaoInfo.NotificandoID = int.Parse(notificandoID);
                                //notificacaoInfo.EnderecoID = int.Parse(enderecoID);
                                notificacaoInfo.MatriculaImovel = int.Parse(matricula);
                                notificacaoInfo.Observacao = observacoes;                            
                                
                            }
                            else
                            {
                                var notificacao = new Notificacao()
                                {
                                    NotificadorID = notificadorID,
                                    
                                };

                                db.Notificacaos.InsertOnSubmit(notificacao);
                            }

                            db.SubmitChanges();

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true
                            });
                        }
                        catch (Exception ex)
                        {
                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = false,
                                msgRp = ex.Message
                            });
                        }
                    }
                    break;

                case "lista-notificadores":

                    var deixe = int.Parse(context.Request["deixe"]);
                    var tome = int.Parse(context.Request["tome"]);

                    {
                        try
                        {
                            var lista = db.Notificadors.Where(o => o.Status)
                               .ToList()
                               .Select(o => new
                               {
                                   o.ID,
                                   Nome = o.Nome,
                                   Cpf = o.CPF,
                                   Telefone = o.Telefone,
                                   Email = o.Email,
                                   Tipo = o.Tipo == true ? "Administrador" : "Comum"

                               })
                               .OrderBy(o => o.Nome).ThenBy(o => o.Email).ToList();

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                lista = lista.Skip(deixe).Take(tome),
                                cnt = lista.Count

                            });
                        }
                        catch (Exception ex)
                        {
                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = false,
                                msgRp = ex.Message
                            });
                        }
                    }
                    break;

                case "combo-notificadores":

                    {
                        try
                        {
                            var lista = db.Notificadors.Where(o => o.Status)
                               .ToList()
                               .Select(o => new
                               {
                                   o.ID,
                                   o.Nome
                               })
                               .OrderBy(o => o.Nome).ToList();

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                lista
                            });
                        }
                        catch (Exception ex)
                        {
                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = false,
                                msgRp = ex.Message
                            });
                        }
                    }
                    break;

                case "buscar-dados-notificador":
                    {
                        try
                        {
                            var notificadorID = context.Request["notificadorID"];
                            var notificadorInfo = db.Notificadors.Single(o => o.ID == int.Parse(notificadorID));

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                nome = notificadorInfo.Nome,
                                telefone = notificadorInfo.Telefone,
                                cpf = notificadorInfo.CPF,
                                email = notificadorInfo.Email,
                                usuario = notificadorInfo.Usuario,
                                senha = notificadorInfo.Senha,
                                tipo = notificadorInfo.Tipo
                            });
                        }
                        catch (Exception ex)
                        {
                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = false,
                                msgRp = ex.Message
                            });
                        }
                    }
                    break;

                case "excluir-notificador":
                    {
                        try
                        {
                            var notificadorID = context.Request["notificadorID"];
                            var notificadorInfo = db.Notificadors.SingleOrDefault(o => o.ID == int.Parse(notificadorID));

                            notificadorInfo.Status = false;
                            db.SubmitChanges();

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                            });
                        }
                        catch (Exception ex)
                        {
                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = false,
                                msgRp = ex.Message
                            });
                        }
                    }
                    break;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}