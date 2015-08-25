MultipleImages 
=============

A dojo widget for adding images to a page or block in EPiServer 8 and above. 


Usage
-------------

**Add the code to your project:**

You may use the same folder structure as this repository. Remember to update the namespaces in the class-files, or else you'll get several build errors. 

***Module.config***

I recommend to update the widget namespace (mapping between your js-script and dojo loader configuration). 
I guess you want a different name than "alloy". After you've updated the name-tag in the module.config you must update the ClientEditingClass in MultipleImagesEditorDescriptor.cs. It's important that the namespace is in all lower-case, otherwise your widget won't be found, probably with a 404 pointing to /EPiServer/Shell/7.x.x.x/[..].

****FullRefreshPropertiesMetaData****

So that the view will update itself without a full refresh after editing the content, you may want to add FullRefreshPropertiesMetaData. 
You can do it like this: 

Add following code to your controller
```HTML
var editingHints = ViewData.GetEditHints<YouPageTypeViewModel, YouPageType>();
editingHints.AddFullRefreshFor(p => p.YourPropertyName);
```

Add following code to your view
```HTML
@Html.FullRefreshPropertiesMetaData()
```

For more info about FullRefreshPropertiesMetaData you can read this [page](http://world.episerver.com/documentation/Items/Developers-Guide/EPiServer-CMS/8/Content/Edit-hints-in-MVC/ "Editing hints in MVC")



**Add property to a page or block:**

```
[UIHint("MultipleImagesEditor")]
[BackingType(typeof(PropertyMultipleImages))]
[Display(GroupName = SystemTabNames.Content, Order = 10)]
public virtual MultipleImages <PropertyName> { get; set; }
```

