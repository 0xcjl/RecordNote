const {test}=require('node:test');
const assert=require('node:assert/strict');
const Module=require('node:module');
const controls=new Map();
class Control {setValue(){return this} setButtonText(){return this} addOption(){return this} setDisabled(){return this} onChange(fn){this.change=fn;return this} onClick(fn){this.click=fn;return this}}
class Setting {constructor(){this.control=new Control()} setName(name){controls.set(name,this.control);return this} setDesc(){return this} addText(fn){fn(this.control);return this} addDropdown(fn){fn(this.control);return this} addButton(fn){fn(this.control);return this} addComponent(fn){fn({});return this}}
class SecretComponent extends Control {}
const load=Module._load;Module._load=function(name,...args){if(name==='obsidian')return {Plugin:class{},PluginSettingTab:class{},Setting,SecretComponent,Notice:class{},Modal:class{}};return load.call(this,name,...args)};
const Plugin=require('./main.js');Module._load=load;
function setup(testTextConnection){controls.clear();const elements=[];const plugin={settings:{secret:'key',model:'old',base:'https://api.minimaxi.com',textProvider:'minimax',asrProvider:'minimax'},saveData:async()=>{},testTextConnection};const page=new Plugin.VoiceSettings({},plugin);page.containerEl={empty(){},createEl(_type,opts){const item={text:opts.text,setText(t){this.text=t}};elements.push(item);return item}};page.display();return {plugin,status:elements.find(x=>x.text==='文字服务连接：尚未测试'),model:controls.get('文字模型'),button:controls.get('测试文字服务')};}
test('changing the text model clears an earlier successful connection result',async()=>{const x=setup(async()=>{});await x.button.click();assert.equal(x.status.text,'文字服务连接：成功');await x.model.change('new');assert.equal(x.status.text,'文字服务连接：配置已更改，请重新测试');});
test('a response for an old configuration cannot mark the new configuration successful',async()=>{let finish;const x=setup(()=>new Promise(resolve=>finish=resolve));const pending=x.button.click();assert.equal(x.status.text,'文字服务连接：正在测试');await x.model.change('new');finish();await pending;assert.equal(x.status.text,'文字服务连接：配置已更改，请重新测试');});
