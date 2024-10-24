using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeeClaims.View.Models
{
    public class CompaniaViewModel
    {
        public int Id { get; set; }
        public string NombreCompania { get; set; }
        public string NombrePersonaContacto { get; set; }
        public string CorreoElectronico { get; set; }
        public string Telefono { get; set; }
    }
}