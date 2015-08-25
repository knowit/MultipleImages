using System;
using System.Collections.Generic;
using AlloyEpi8.Models.Properties;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Framework.DataAnnotations;
using EPiServer.PlugIn;
using EPiServer.ServiceLocation;
using EPiServer.SpecializedProperties;

namespace AlloyEpi8.Business.CustomProperties
{
    [EditorHint("MultipleImagesEditor")]
    [PropertyDefinitionTypePlugIn(Description = "A property for multiple images", DisplayName = "Multiple images")]
    public class PropertyMultipleImages : PropertyLongString
    {
        public override Type PropertyValueType
        {
            get { return typeof(MultipleImages); }
        }

        public override object SaveData(PropertyDataCollection properties)
        {
            return LongString;
        }

        public override object Value
        {
            get
            {
                var value = base.Value as string;

                if (value == null)
                {
                    return null;
                }

                return new MultipleImages(value);
            }
            set
            {
                if (value is MultipleImages)
                {
                    var s = value as MultipleImages;
                    base.Value = s;
                }
                else
                {
                    base.Value = value;
                }

            }
        }
    }
}

[ServiceConfiguration(typeof(IPropertySoftLinkIndexer))]
public class ImagesStringPropertyIndexer : IPropertySoftLinkIndexer<MultipleImages>
{
    public IEnumerable<SoftLink> ResolveReferences(MultipleImages propertyValue, IContent owner)
    {
        if (propertyValue == null || propertyValue.ElementsList == null)
        {
            return new List<SoftLink>();
        }

        var softLinks = new List<SoftLink>();
        foreach (var link in propertyValue.ElementsList)
        {
            var softLink = ContentSoftLinkIndexer.CreateSoftLinkForContent(owner);
            softLink.ReferencedContentLink = link.ContentLink;
            softLink.SoftLinkType = ReferenceType.PageLinkReference;
            softLinks.Add(softLink);
        }
        return softLinks;
    }
}