using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Web;

namespace EasyRoute.Utils
{
    public class MetodosWeb
    {
        public static void Serializar(HttpContext context, object objeto)
        {
            context.Response.Write(JsonConvert.SerializeObject(objeto));
        }

        public static InfoCep PesquisarCepOnline(string cep)
        {

            if (string.IsNullOrWhiteSpace(cep))
                throw new ArgumentException("CEP não pode ser nulo ou vazio.");

            cep = cep.Replace("-", "").Replace(".", "").Replace("/", "").Replace("(", "").Replace(")", "").Replace(" ", "");

            if (!Regex.IsMatch(cep, @"^\d{8}$"))
                throw new ArgumentException("CEP inválido. Deve conter 8 dígitos numéricos.");

            try
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Clear();
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    using (var request = new HttpRequestMessage(HttpMethod.Get, string.Format("https://viacep.com.br/ws/{0}/json/", cep)))
                    {
                        using (var response = httpClient.SendAsync(request).Result)
                        {
                            var resultContent = response.Content.ReadAsStringAsync().Result;

                            if (response.IsSuccessStatusCode)
                            {
                                return JsonConvert.DeserializeObject<InfoCep>(resultContent);
                            }
                            else
                            {
                                throw new Exception();
                            }
                        }
                    }

                }
            }

            catch (Exception)
            {
                throw;
            }
        }

    }

    public class InfoCep
    {
        public string logradouro { get; set; }
        public string complemento { get; set; }
        public string bairro { get; set; }
        public string localidade { get; set; }
        public string uf { get; set; }
        public string erro { get; set; }
    }
}