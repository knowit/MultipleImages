using System;
using System.Linq;
using EPiServer.ServiceLocation;
using Newtonsoft.Json;

namespace AlloyEpi8.Models.Properties
{
    [ServiceConfiguration(typeof(JsonConverter))]
    public class MultipleImagesConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return typeof(MultipleImages).IsAssignableFrom(objectType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return reader.Value == null ? null : new MultipleImages(reader.Value.ToString());
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var elements = value as MultipleImages;

            if (elements == null || !elements.Elements.Any())
            {
                writer.WriteValue(string.Empty);
                return;
            }

            writer.WriteValue(elements.ToString());
        }
    }
}