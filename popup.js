
//a tricky function for parsing the domain name from a url
function url_domain(data)
{
	var a=document.createElement('a');
	a.href=data;
	return a.hostname;
}

function myFunction(tab) 
{
  var domainname = url_domain(tab.url);
  var div = document.getElementById('main');
  
  chrome.bookmarks.search(domainname,function(results){
        //If no results found 
		if(results.length<=0)
        {
            var txt= document.createElement('p');
			txt.innerText="No Bookmark from this domain.";
			div.appendChild(txt);
            return;
        }
  
		var filter_result = 0;
		//iterating through the result list
		results.forEach(function(child){
		
			/** Custom Filtering:
			* Chrome bookmark search API has weird searching option, doesn't search with the exact string match
			* what they actually do is a mystery, none of their documentation have shed any light in this matter
			* That's why i need to add this substring search Condition checking for the exact domain name matching.
			**/
			if(child.url.search(domainname)!=-1)
			{
				filter_result++;
				var row=document.createElement('div');
				row.className = "row";
				div.appendChild(row);

				var link = document.createElement('a');
				link.setAttribute("href",child.url);
				link.setAttribute("target","_blank");
				link.innerText=child.title;
				link.className="tooltip";
			
				row.appendChild(link);
			
				var buttonnode= document.createElement('span');
				buttonnode.innerText= "Remove this bookmark";
				buttonnode.className="button red small";
				buttonnode.onclick=(function (){
					return function(){
						var message=confirm("Are sure you want to delete this bookmark?");
						if(message==true)
						{
							chrome.bookmarks.remove(String(child.id));
							location.reload();
						}
					};
					})();
				
				row.appendChild(document.createElement('br'));
				row.appendChild(buttonnode);
			}
		
	});	
		//If all results skipped by the custom filtering 
		if(filter_result<=0)
        {
            var txt= document.createElement('p');
			txt.innerText="No Bookmark from this domain.";
			div.appendChild(txt);
        }
  });
}

chrome.tabs.getSelected(null, function(tab) {
    myFunction(tab);
});