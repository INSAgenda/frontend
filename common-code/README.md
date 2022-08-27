When some code is shared between multiple pages, place it into a file in `/common-code`.  
Then, replace it by the following code.  
Make sure to rename `PATH` to the path to the file (without the extension).  

```js
<script common_code="PATH">async function u(a,b){let c=await (await fetch(b)).text();a.outerHTML=c}var e=document.currentScript;u(e,"/common-code/"+e.getAttribute("common_code")+".html")</script>
```

The production server will inline the code for optimization purposes.
