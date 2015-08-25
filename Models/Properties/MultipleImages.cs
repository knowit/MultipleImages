using System;
using System.Collections.Generic;
using AlloyEpi8.Models.Media;
using EPiServer;
using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using Newtonsoft.Json;

namespace AlloyEpi8.Models.Properties
{
    public class MultipleImages
    {
        public MultipleImages(string serializedObject)
        {
            Elements = serializedObject;
            ElementsList = ConvertImagesToList(serializedObject);
        }

        public string Elements { get; set; }
        public List<MultipleJsonImage> ElementsList { get; set; } 

        public override string ToString()
        {
            return Elements;
        }

        private List<MultipleJsonImage> ConvertImagesToList(string serializedString)
        {
            var images = new List<MultipleJsonImage>();

            if (!string.IsNullOrEmpty(serializedString))
            {
                images = JsonConvert.DeserializeObject<List<MultipleJsonImage>>(serializedString);
            }

            var contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();

            foreach (var item in images)
            {
                try
                {
                    var guid = PermanentLinkUtility.GetGuid(item.PermanentUrl);
                    var contentRef = PermanentLinkUtility.FindContentReference(guid);
                    var image = contentLoader.Get<ImageFile>(contentRef);

                    item.ContentLink = contentRef;
                    item.Image = image;
                }
                catch (Exception e)
                {
                    //TODO: log exception...
                }
            }
            return images;
        } 
    }

    public class MultipleJsonImage
    {
        public string PermanentUrl { get; set; }
        public string PreviewUrl { get; set; }
        public string Text { get; set; }
        public string PublictypeIdentifier { get; set; }
        public string Url { get; set; }
        public string Desc { get; set; }
        public ContentReference ContentLink { get; set; }
        public ImageFile Image { get; set; }
    }
}