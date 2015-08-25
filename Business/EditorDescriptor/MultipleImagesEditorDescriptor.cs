using System;
using System.Collections.Generic;
using AlloyEpi8.Models.Properties;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;

namespace AlloyEpi8.Business.EditorDescriptors
{
  [EditorDescriptorRegistration(TargetType = typeof(MultipleImages), UIHint = "MultipleImagesEditor")]
  public class MultipleImagesEditorDescriptor : EditorDescriptor
  {
    public override void ModifyMetadata(EPiServer.Shell.ObjectEditing.ExtendedMetadata metadata, IEnumerable<Attribute> attributes)
    {
        ClientEditingClass = "alloy/editors/MultipleImagesEditor";

      base.ModifyMetadata(metadata, attributes);
    }
  }
}