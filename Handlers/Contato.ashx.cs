using EasyRoute.Utils;
using System;
using System.Linq;
using System.Web;

namespace EasyRoute.Handlers
{
    public class ContatoHandler : IHttpHandler
    {
        private readonly EasyRouteDataContext db = new EasyRouteDataContext();

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";

            if (context.Request["acao"] == null)
                return;

            var acao = context.Request["acao"].ToLower();
            var contatoId = context.Request["contatoId"];

            switch (acao)
            {
                case "cadastrar-editar-contato":
                    {
                        try
                        {
                            var enderecoId = context.Request["enderecoId"];
                            var nome = context.Request["nome"];
                            var telefone = context.Request["telefone"];
                            var cpf = context.Request["cpf"];
                            var email = context.Request["email"];
                            var logradouro = context.Request["logradouro"];
                            var numero = context.Request["numero"];
                            var bairro = context.Request["bairro"];
                            var complemento = context.Request["complemento"];
                            var cep = context.Request["cep"];
                            var cidade = context.Request["cidade"];
                            var estado = context.Request["estado"];
                            var seriaInsercaoEndereco = context.Request["seriaInsercaoEndereco"];
                            var seriaEdicao = false;
                            var novoContatoId = 0;

                            //Update
                            if (!string.IsNullOrEmpty(contatoId)) 
                            {
                                if (!bool.Parse(seriaInsercaoEndereco))
                                {
                                    var contato = db.Contato.SingleOrDefault(o => o.Id == int.Parse(contatoId));
                                    contato.Nome = nome;
                                    contato.Telefone = telefone;
                                    contato.Cpf = cpf;
                                    contato.Email = email;
                                }
                                
                                if (int.Parse(enderecoId) > 0 && bool.Parse(seriaInsercaoEndereco))
                                {
                                    var endereco = db.Endereco.SingleOrDefault(o => o.Id == int.Parse(enderecoId));
                                    endereco.Logradouro = logradouro;
                                    endereco.Numero = numero;
                                    endereco.Bairro = bairro;
                                    endereco.Complemento = complemento;
                                    endereco.Cep = cep;
                                    endereco.Cidade = cidade;
                                    endereco.Estado = estado;
                                }
                                else if (bool.Parse(seriaInsercaoEndereco))
                                {
                                    var endereco = new Endereco()
                                    {
                                        Logradouro = logradouro,
                                        Numero = numero,
                                        Bairro = bairro,
                                        Complemento = complemento,
                                        Cep = cep,
                                        Cidade = cidade,
                                        Estado = estado,
                                        Status = true,
                                        ContatoId = int.Parse(contatoId)
                                    };
                                    db.Endereco.InsertOnSubmit(endereco);
                                }

                                novoContatoId = int.Parse(contatoId);
                                seriaEdicao = true;
                            }
                            //Insert
                            else
                            {
                                var novoContato = new Contato()
                                {
                                    Nome = nome,
                                    Telefone = telefone,
                                    Cpf = cpf,
                                    Email = email,
                                    Status = true

                                };
                                db.Contato.InsertOnSubmit(novoContato);
                                db.SubmitChanges();

                                var endereco = new Endereco()
                                {
                                    Logradouro = logradouro,
                                    Numero = numero,
                                    Bairro = bairro,
                                    Complemento = complemento,
                                    Cep = cep,
                                    Cidade = cidade,
                                    Estado = estado,
                                    Status = true,
                                    ContatoId = novoContato.Id
                                };
                                db.Endereco.InsertOnSubmit(endereco);

                                novoContatoId = novoContato.Id;
                            }

                            db.SubmitChanges();

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                seriaEdicao,
                                seriaInsercaoEndereco,
                                novoContatoId
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

                case "lista-contatos":

                    var deixe = int.Parse(context.Request["deixe"]);
                    var tome = int.Parse(context.Request["tome"]);

                    {
                        try
                        {
                            var lista = db.Contato.Where(o => o.Status)
                               .ToList()
                               .Select(o => new
                               {
                                   o.Id,
                                   Nome = o.Nome,
                                   Cpf = o.Cpf,
                                   Telefone = o.Telefone,
                                   Email = o.Email
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

                case "buscar-dados-contato":
                    {
                        try
                        {
                            var contato = db.Contato.SingleOrDefault(o => o.Id == int.Parse(contatoId));

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                contatoId = contato.Id,
                                nome = contato.Nome,
                                telefone = contato.Telefone,
                                cpf = contato.Cpf,
                                email = contato.Email
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

                case "excluir-contato":
                    {
                        try
                        {
                            var contato = db.Contato.SingleOrDefault(o => o.Id == int.Parse(contatoId));

                            contato.Status = false;
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

                case "lista-enderecoscontato":

                    if (String.IsNullOrEmpty(contatoId))
                        contatoId = "0";

                    deixe = int.Parse(context.Request["deixe"]);
                    tome = int.Parse(context.Request["tome"]);

                    {
                        try
                        {
                            var lista = db.Endereco.Where(o => o.ContatoId == int.Parse(contatoId) && o.Status)
                               .ToList()
                               .Select(o => new
                               {
                                   ContatoId = contatoId,
                                   EnderecoId = o.Id,
                                   Logradouro = o.Logradouro.Length > 20 ? o.Logradouro.Substring(0, 20) + "..." : o.Logradouro,
                                   LogradouroCompleto = o.Logradouro,
                                   Numero = o.Numero,
                                   Bairro = o.Bairro.Length > 15 ? o.Bairro.Substring(0, 15) + "..." : o.Bairro,
                                   BairroCompleto = o.Bairro,
                                   Complemento = !string.IsNullOrEmpty(o.Complemento) && o.Complemento.Length > 9? o.Complemento.Substring(0, 6) + "...": o.Complemento ?? string.Empty,
                                   ComplementoCompleto = o.Complemento ?? string.Empty,
                                   Cep = o.Cep,
                                   Cidade = o.Cidade.Length > 15 ? o.Cidade.Substring(0, 15) + "..." : o.Cidade,
                                   CidadeCompleto = o.Cidade,
                                   Estado = o.Estado
                               })
                               .OrderBy(o => o.Estado).ThenBy(o => o.Cidade).ToList();

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

                case "buscar-dados-endereco":
                    {
                        try
                        {
                            var enderecoId = context.Request["enderecoId"];
                            var endereco = db.Endereco.SingleOrDefault(o => o.Id == int.Parse(enderecoId));

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                contatoId = int.Parse(contatoId),
                                enderecoId,
                                logradouro = endereco.Logradouro,
                                numero = endereco.Numero,
                                bairro = endereco.Bairro,
                                complemento = endereco.Complemento,
                                cep = endereco.Cep,
                                cidade = endereco.Cidade,
                                estado = endereco.Estado
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

                case "excluir-endereco-contato":
                    {
                        try
                        {
                            var enderecoId = context.Request["enderecoId"];
                            var endereco = db.Endereco.SingleOrDefault(o => o.Id == int.Parse(enderecoId));

                            var qtdeEnderecos = db.Endereco.Where(o => o.ContatoId == int.Parse(contatoId) && o.Status).Count();

                            if (qtdeEnderecos <= 1)
                            {
                                MetodosWeb.Serializar(context, new
                                {
                                    sucesso = false,
                                    msgRp = "É necessário existir ao menos um endereço"
                                });

                                return;
                            }

                            endereco.Status = false;
                            db.SubmitChanges();

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                contatoId
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

                case "pesquisar-cep":
                    {
                        try
                        {
                            var cep = context.Request["cep"];

                            var respostaCep = MetodosWeb.PesquisarCepOnline(cep);

                            MetodosWeb.Serializar(context, new
                            {
                                sucesso = true,
                                
                                logradouro = respostaCep.logradouro,
                                bairro = respostaCep.bairro,
                                complemento = respostaCep.complemento,
                                cidade = respostaCep.localidade,
                                estado = respostaCep.uf,
                                erro = respostaCep.erro
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
