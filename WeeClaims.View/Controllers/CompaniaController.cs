using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WeeClaims.View.Models;

namespace WeeClaims.View.Controllers
{
    public class CompaniaController : Controller
    {
        private readonly HttpClient _httpClient;

        public CompaniaController() 
        {
            _httpClient = new HttpClient();
        }

        public ActionResult CapturaCompania()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> CapturaCompania(string nombreCompania, string nombrePersonaContacto, string correoElectronico, string telefono) 
        {
            try
            {
                var data = new
                {
                    NombreCompania = nombreCompania,
                    NombrePersonaContacto = nombrePersonaContacto,
                    CorreoElectronico = correoElectronico,
                    Telefono = telefono
                };

                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var apiUrl = "https://localhost:44320/api/Compania";

                var response = await _httpClient.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Datos Guardados Correctamente" });
                }
                else 
                {
                    return Json(new { success = false, message = "Error al guardar los datos" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message  });
            }
        }

        [HttpGet]
        public async Task<ActionResult> ObtenerCompanias() 
        {
            try
            {
                var apiUrl = "https://localhost:44320/api/Compania";
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        var registrosJson = await response.Content.ReadAsStringAsync();
                        var registros = JsonConvert.DeserializeObject<List<CompaniaViewModel>>(registrosJson);

                        var registrosSerializados = JsonConvert.SerializeObject(registros);
                        return Content(registrosSerializados, "application/json");  // Enviar JSON como ContentResult
                    }
                    else
                    {
                        return new HttpStatusCodeResult(400, "No se pudieron obtener los registros.");
                    }
                }

            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(500, "Error al consultar la informacion." +  ex.Message);
            }
        }
    }
}