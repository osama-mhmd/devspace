export const defaultDocumentContent = {
  en: `
<div data-type="success" class="callout success"><span class="emoji">✅</span><div class="content">Hello there 👋! Welcome to nonote, where is the simplicity, customizability, and any ability, to make like this callout just type <code>!s</code> and space. </div></div><div data-type="error" class="callout error"><span class="emoji">❌</span><div class="content">Don’t close the tap if the app is still syncing. To make like this callout just type <code>!e</code>. Also type <code>!i</code> for another variant (info).</div></div><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>To make a task just type <code>[]</code> and space</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>This task is completed</p></div></li></ul><ul><li><p>Type <code>-</code> or <code>*</code> to make a bullet list</p></li></ul><p>Double enter to exit from list mode</p><p></p><h1>Type <code>#</code> to make a H1 heading</h1><p>If you want to add a comment, just select the text and click ‘comment’!</p><pre><code class="language-ts">// this is a code block (typescript)
// just type '\`\`\`{lang}' to get started. Example: '\`\`\`js' and enter

const name = "nonote";

while(true) {
  alert("Nonote is the best!")
}

// "Enter + Shift" to get escape from the code block</code></pre><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>You could change the banner at the top if you need</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>This is <strong>bold</strong>, just type **text** or “Ctrl + B”</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p><em>Italic</em>, Ctrl + I, or *text*</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>type \`text\` to add a code</p></div></li></ul><h2>Your next steps 💪</h2><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Visit us on Github <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/osama-mhmd/nonote">https://github.com/osama-mhmd/nonote</a>, Give us a star ⭐, and help us improve our application</p><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>If you have any issues, or features</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Or even clone it and make your custom application 💖</p></div></li></ul></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Or share our app 🤙</p></div></li></ul>`,
  ar: `<div data-type="success" class="callout success"><span class="emoji">✅</span><div class="content">أهلا بكم 👋! أهلا بكم إلى nonote، حيث توجد البساطة، والقدرة على تغيير أي شيء ليناسبك. لتنشيء مثل هذا التنبيه فقط اكتب <code>!s</code> وبعد ذلك مسافة</div></div><div data-type="error" class="callout error"><span class="emoji">❌</span><div class="content">لا تقم بغلق الصفحة إذا لازالت تقوم بالمزامنة. لتنشيء مثل هذا التنبيه اكتب <code>!e</code>، هناك أيضا أنواع أخري ك <code>!i</code></div></div><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>كي تنشيء قائمة مهام اكتب [] وبعد ذلك مسافة</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>تم إنهاء المهمة</p></div></li></ul><ul><li><p>اكتب “*” أو “-” كي تنشيء مثل هذه القائمة</p></li></ul><p>اضعط ضغطتين على ال”enter” لتخرج من القائمة</p><p></p><h1>اكتب <code>#</code> لتنشيء عنوان رئيسي</h1><p>إذا كنت تريد إضافة تعليق، فقط حدد النص ثم اضغط تعليق</p><pre><code class="language-ts">// this is a code block (typescript)
// just type '\`\`\`{lang}' to get started. Example: '\`\`\`js' and enter

const name = "nonote";

while(true) {
  alert("Nonote is the best!")
}

// "Enter + Shift" to get escape from the code block</code></pre><p><strong><em>يمكنك إستخدام نفس إختصارات MarkDown</em></strong></p><h2>ماذا بعد ذلك 💪</h2><p>زرنا على جت هب <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/osama-mhmd/nonote">https://github.com/osama-mhmd/nonote</a>، وقم بإعطائنا نجمة، وساعدنا لكي نطور التطبيق. إذا كان لديك أية ميزات أو مشاكل قم بإخبارنا.</p><p>تذكر أن هذا التطبيق مفتوح المصدر، يمكنك نسخه أو صنع النسخة الخاصة بك.</p><p>لا تنسي المشاركة 🤙</p>`,
};
export const defaultDocumentTitle = {
  en: "<h1>Welcome 👋!</h1>",
  ar: "<h1>مرحبا بكم 👋!</h1>",
};
