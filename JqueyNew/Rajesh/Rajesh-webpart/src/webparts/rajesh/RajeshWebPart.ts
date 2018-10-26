import { Version,Environment, EnvironmentType  } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
require("bootstrap");
import{SPComponentLoader} from '@microsoft/sp-loader'; 
import styles from './RajeshWebPart.module.scss';
import * as strings from 'RajeshWebPartStrings';
export interface IRajeshWebPartProps {
  description: string;
}
export default class RajeshWebPart extends BaseClientSideWebPart<IRajeshWebPartProps> {
 public render(): void {
    let cssurl="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssurl);
    this.domElement.innerHTML = `    
        <div class="container">
        <div id="myCarousel" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ol class="carousel-indicators">
        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
        <li data-target="#myCarousel" data-slide-to="1"></li>
        <li data-target="#myCarousel" data-slide-to="2" class="active"></li>
        <li data-target="#myCarousel" data-slide-to="3"></li>
        <li data-target="#myCarousel" data-slide-to="4" class="active"></li>
        <li data-target="#myCarousel" data-slide-to="5"></li>
        </ol>
        <!-- Wrapper for slides -->
        <div class="carousel-inner" id="Innerbind">
        <div>
       <!-- Left and right controls -->
<a class="left carousel-control" href="#myCarousel" data-slide="prev">
<span class="glyphicon glyphicon-chevron-left"></span>
</a>       
   <a class="right carousel-control" href="#myCarousel" data-slide="next">
<span class="glyphicon glyphicon-chevron-right"></span>
</a>
</div>

                       <!-- Modal -->


  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content" id="dispc">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Modal Header</h4>
        </div>
        <div class="modal-body">
          <p>Some text in the modal.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
      
    </div>
  </div>
</div>
    `;
      this.GetData();
     //this.Readyfunction();


  }
  private GetData() {

    var curl = this.context.pageContext.web.absoluteUrl;
    let html: string = '';
    if (Environment.type === EnvironmentType.Local) {
      this.domElement.querySelector('#test').innerHTML = "sorry this does not work in local workbench";
    }

    else {
      // this.context.spHttpClient.get 
      // ( 
//alert("Enterd");


      var call = $.ajax({
      

        //?$top=1$select=ID,Title&$filter=(Expires ge datetime'" + d + "')&$orderby=Expires desc"
        url: curl + "/_api/web/lists/getByTitle('Managers Speaks')/Items/?$select= Id,ImageUrl,Subject,Description&$top=5&$orderby=Id desc",
        type: "GET",
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });
      call.done(function (data,textStatus,jqXHR) {
   
         var Slide = $("#Innerbind");
        
        
      //     var message2 = $("#c2");
      //    var message3 = $("#c3");
     
          // $.each(data.d.results, function(index, value) {
          //   message1.append("<img src="+ value.ImageUrl + "style="+"width:100% ;>");
          // subject1.append("<h3><p> "+ value.Subject+"</p> </h3>");
          var Active;
      
         $.each(data.d.results, function (index,value) {
          if(index=='0'){Active="item active"}else{Active="item"};
        //  SlideAddTag="<div class='"+ItemActive+"'><img src='"+value.ImageUrl+"'  style='width:60%;' ><div class='carousel-caption'><h3>"+value.Subject+"</h3><button id= "+value.Id+ " type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal' >KnowMore</button></div> </div>";
         // alert(value.Id);
      
         Slide.append("<div class='"+Active+"'><img src='"+value.ImageUrl+"'  style='width:60%;' ><div class='carousel-caption'><h3>"+value.Subject+"</h3><button id= "+value.Id+ " type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal' >KnowMore</button></div> </div>");  

        
  
          
          // $('<div class="item"><img src="'+value.ImageUrl+' " style="width:50%;" ><div class="carousel-caption"><h3>"'+value.Subject+'"</h3></div> </div>').appendTo('.carousel-inner');
         //$('<li data-target="#carousel-myCarousel" data-slide-to='+ index.toString() +'></li>').appendTo('.carousel-indicators')
        }); 

          // message2.append(value.Subject);
          // message3.append(value.Description);


        });

      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });

       $(document).on("click", ".btn-primary" , function() {
         var id= $(this).attr("Id");
        // alert(id);
         var call = $.ajax({
          url: curl + "/_api/web/lists/getByTitle('Managers Speaks')/Items/?$select= Id,ImageUrl,Subject,Description&$filter=(Id eq '"+id+"')",
          type: "GET",
          dataType: "json",
          headers: {
            Accept: "application/json;odata=verbose"
          }
        });
        call.done(function (data) {
         // alert("sucess");

          $.each(data.d.results, function (index, value) {
           //alert(value.Subject);
           $("#dispc").empty();
           var message = $("#dispc");
           message.append(`
          <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">${value.Subject}</h4>
        </div>
        <div class="modal-body">
        <div>
        <img src='${value.ImageUrl}' alt="Oops Not Displayed" style="width:100%;" />
              <p>${value.Description}</p>
        </div>
        </div>
           
           
           `)


          });



        });
        call.fail(function (jqXHR, textStatus, errorThrown) {
          var response = JSON.parse(jqXHR.responseText);
          var message = response ? response.error.message.value : textStatus;
          alert("Call failed. Error: " + message);
        });
      });


       }
  }


  
  


  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
