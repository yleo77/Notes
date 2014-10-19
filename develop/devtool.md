## 概述

自从习惯了 Chrome 作为日常浏览器之后，在开发过程中也一直在使用 Chrome 的 Devtool 作为调试工具，发现了其中很多好用的地方，这篇文章对这些功能以面板维度为区分做一个回顾和引述。

## Elements面板

有时候我们需要查看某一个特定元素绑定的事件，在这个面板可以直接查看到（或者借助 Command Line API: getEventListener），选择 Elements 面板右侧的 *Event Listeners*，这里会显示出所有可以发生在这个元素的事件（捕获和冒泡），但是这往往不是大多数场景下我们想要的，大部分场景想要的是查看自身绑定的事件，也是可以做到的，只需要在最右侧下拉中选择 *Selected Node Only* 的选项就可以了，如图。

![selected_node_only](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/selected_node_only.png)

因为浏览器里的编程大多数是和 DOM 紧密结合在一起的，JS 中也往往会存在一些改变 DOM 树结构有关 UI 的业务逻辑，所以调试过程中我们就经常需要去检查 DOM 的改变情况以及程序后续所做出的逻辑响应，那么这个时候可以借助 Break on 功能来辅助 debug。

当选中一个元素右键查看 *Break on* 的子选项时，可以看到这里提供 几个 DOM Level 3 的事件监听选项以及节点被移除时的中断。分别对应 *DOMSubtreeModified*，*DOMNodeRemoved* 和 *DOMAttrModified*，虽然说现在的大部分业务代码不太会监听这样的事件，但是断点监听调试的场景是非常多的。

![break_on](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/break_on.png)

肯定所有人都知道右键选择 `Edit as HTML` 可以编辑选中部分的 HTML 源代码，这个功能应该是非常常用了，是吧，既然常用，就记住快捷键吧 `F2`，按`F2`进入编辑模式，再按`F2`进入普通模式（N 久前不知道的时候习惯了编辑完按 ESC 真是抓狂）。

另外，`CMD + F` 是用来根据关键字搜 HTML ，但它还**支持 CSS Selector**的形式。


## Sources 面板

### 中断

在 Sources 面板的右侧，大部分情况下，我们最常用的可能是*Watch Expressions* , *Breakpoints* 但除了常用的这几个， 其还包括 *Event listener breakpoints*，*Dom Breakpoints*,  *xhr breakpoints*， *workers* 这几大类

![source_right_panel](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/source_right_panel.png)

见上图，比如 Event Listener Breakpoints 区域， 当触发什么事件时中断，事件可以除了常规的键盘事件，鼠标事件，还有几大类，Animation，Clipboard，Device，DOM Mutation，Touch，XHR，Load，甚至还有 Timer(在 setTimeout setInterval 处理函数开始执行时中断)，看图估计就都会用了。

XHR Breakpoints 区域，简而言之就是当 ajax 时中断，对开发便利之处是，这里可以添加规则，当 url 包含某些字符时自动中断。以及 workers 中断。

DOM Breakpoints 则对应的就是在 Elements 面板中添加的被 Break on 的元素了。

### 定位

定位基本是通过快捷键来完成，并且这些快捷键大多数情况下是和其他工具相通的。

* 定位文件 `cmd + o`  或者 `cmd + p`  (对应于 sublime 的 cmd + p)
* 定位行号 `Ctrl + g` ，其实是 `cmd + p`，再输入 : 的简写。 (对应于 sublime 的 Ctrl + g)
* 定位函数：  `cmd + Shift + p` （或者 `cmd + Shift + o` ）   (对应于 st 的 cmd + r)

### 其他

Sources 面板提供了就地编辑 js 和 css 的功能(不能编辑 html 中的内联资源，html 的编辑是通过 elements 面板进行的)，当cmd + s 保存后，会立即生效。需要区分的是 内联的 css 编辑完之后可以生效的，但 js 不可以。

### 大杀器

全局搜索  `cmd + opt + f`, 可以搜索当前页面中的任意 js，css，html 中的关键字，还**支持正则**。


## Network 面板

基本的一点，蓝线是 `DOMContentLoaded`，文档解析完毕；红线是初始资源都已经下载完毕，`load` 事件触发。

看下图，以一个截图为例，前端开发者可能天天都会看，注意其中画线的三个部分。

![network_1](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/network_1.png)

可以看到 Size 和 Time 列有两行数据。那有什么区别呢。

先看 Size 列，下面是 Content，两者的区别在于,第一行数字仅仅是 Response 的 size，包括了 header 和 body 的大小，而第二行才是真正的内容的大小。

通常情况下，因为 web 上访问静态资源都会经过 gzip 的压缩，所以看到的 Content 一般都是要大于 Size 的，但是当内容没有经过 gzip 压缩时，两者可能就是相等的。

以三个例子来分明说明三种情况。

![network_size_1.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/network_size_1.png)

![network_size_2.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/network_size_2.png)

![network_size_3.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/network_size_3.png)


当然也有Size 大于 Content 的情况，比如说 Response Header 中携带了大量的 Cookie 时候。

现在看 Time 列。上行 Time 数字代表获取 Response 总的时间，第二排 Latency 数字代表从开始传输数据到结束总的耗时，所以可以肯定是，第一行数字，永远是大于等于第二行数字的，两者的消耗时间比例也可以从右侧（上图中箭头所指的位置）来看出大概的比例，颜色稍浅的部分等同于 Latency。

这个面板好像也没什么好说的了。

想起有一点改进提一下，点击每个资源，在 Chrome 32 版本 中新增加了 Remote Address(资源远程地址，firefox firebug 一直有这个信息)，这个信息对于经常切换 host，调试 cdn 的朋友估计很有用，来查看确认当前返回的资源是从哪个服务器  IP 来的。以前没有这个 feature 的时候，基本都是通过 Chrome Extension 的形式解决。现在方便多了。如图：

![network_remote_address.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/network_remote_address.jpg)

补充一个坑，看图。右键请求，会有 *Clear Browser Cache* 和 *Clear Browser Cookies*， 功效确实如其名，清除的是浏览器的cache 和 cookie，我最初理解的是出现在这个位置的清除维度应该对应的是当前域名或者是该资源，因为上下文嘛。太容易混淆了，坑死窝了，引以为戒。

![network_clear.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/network_clear.png)


## Timeline 面板

### 总览

平时开发的过程中，可能和 Timeline 面板接触比较少，但是当需要做页面优化或者动画的时候，TImeline 的强大就可以发挥出来了，先以一个简单的例子为入口。

```javascript
// code 1
var h1 = f.clientHeight;    
f.style.height = (h1 + 10) + 'px';

var h2 = b.clientHeight;    
b.style.height = (h2 + 10) + 'px';

var h3 = z.clientHeight;    
z.style.height = (h3 + 10) + 'px';

// code 2 
var h1 = f.clientHeight;
var h2 = b.clientHeight;
var h3 = z.clientHeight;

f.style.height = (h1 + 10) + 'px';
b.style.height = (h2 + 10) + 'px';
z.style.height = (h3 + 10) + 'px';
```

没有什么区别，都是做获取高度，设置高度的事情，但在执行层面上效率的实际情况呢。运行一下，在 Timeline 两者对比一下就知道了。

code 1 的运行图片。

![timeline_1.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_1.jpg)

可以看到 触发了 **3** 次 layout。

再看 code 2 的

![timeline_2.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_2.jpg)

只有 **1** 次。 (备注: 不同的 chrome 版本截图可能会有区别)

原因呢，简单来说就是，尽量避免频繁触发 layout，最佳实践就是分离读写，这个这里不多提到，具体查阅如何减少不必要的layout，paint 方面的文章。现在再来看 Timeline 的作用，显而易见了是吧，它帮我们记住了浏览器从开始加载网页到任意时间段的每一个阶段的执行细节。

通过 Timeline 我们以一个基本的网页来示例梳理从加载到渲染到计算机屏幕都经过了哪些步骤。

![timeline_3.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_3.jpg)


第一阶段： Send Request - > Receive Response -> Receive Data -> Finish Loading. 完成页面自身的加载。
第二阶段： Parse HTML，生成一棵 DOM Tree，如果 HTML 中存在内联脚本就执行，外联脚本或者 CSS 就发请求去加载，并执行，最终在 Recalculate Style 后生成一棵 Render Tree。
第三阶段： Layout  根据元素 width,height, margin, left, top 等信息构造出布局。
第四阶段： Paint  根据元素 color，box-shadow，border-radius，background 等属性渲染元素。
第五阶段/最终完成：Composite Layers， 混合生成位图信息，发送至GPU，渲染到屏幕。

右上角中，三条线 分别给开发者指名了 domready，load 和 first paint 的事件触发时间(分先后顺序)。

来，通过一个精简版本的 timeline 直观看到哪些属性分别是在哪一阶段完成。

![timeline_4.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_4.jpg)

更具体的，关于哪些属性是在 layout 中完成，哪些属性是在 paint 中完成，可以见[这里](http://goo.gl/lPVJY6) 。换句换说也就是当我们修改了元素的哪些属性，就会触发相对应的阶段，所以说，

> The higher up you start on the timeline waterfall the more work the browser has to do to get pixels on to the screen.

根据上面提到的，补充两点：

上图 Panel 中，各个颜色代表是不同的，如下图所示。概括一下就是 蓝色是网络事件，黄色是js 事件，紫色和绿色是 layout 和 render 事件。

![timeline_5.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_5.png)

另外，结合 Console API : console.timeStamp() 可以手动向 timeline 中插入一条记录。

OK，是时候来看 Timeline 面板还提供了哪些功能。

![timeline_6.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_6.jpg)

假设前三个的作用你已经知道（开始记录，清空，过滤）， 第四个垃圾桶的图标是 强制执行一次GC。图中 3 是点击沙漏图标(过滤)后可以根据耗时来选择显示在 RECORDS 里的事件默认提供了 > 1ms 和 > 15 ms，可以根据此来过滤出比较耗时间的事务。

现在看看其他三个。

1. Frame mode   根据渲染性能记录
2. Capture stacks  是否捕获 callstack.
4. Capture memory   根据内存使用情况记录

在前阵子 Chrome 版本的的 Dev Tool 中，是分为三种维度来显示记录，events、frame、memory，之后的升级将 events 模式变为默认的记录方式(所以本节刚开始部分都是 events 模式下的示例)，其他两种通过图中标识进行激活。

### Frame 模式

在 frame 模式下，记录面板将会以 *每一帧* 的形式记录下来在这一帧中浏览器所处理的所有细节。

![timeline_7.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_7.jpg)

根据业界数据普遍公认的一些信息，如果想得到一个平滑的动画，那么，尽可能得将帧率保持在 60 FPS 左右。

直观查看帧的 layer，以及数据情况可以通过下图的方式来看。

![timeline_8.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_8.jpg)


一个鲜活的 demo： [Timeline demo: Diagnosing forced synchronous layouts](https://developer.chrome.com/devtools/docs/demos/too-much-layout)

### Memory Mode

这个模式可以协助你查看当前应用已经分配到的内存情况，注意是没有被垃圾回收的。

![timeline_9.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_9.jpg)


这是一个常见的网页查看内存使用情况，由上图可以看到 memory 的内存使用轨迹，再搭配 Records 中的 事件记录以及 call stack，我们可以很容易直观得看到程序执行过程中堆内存使用情况。

借由此，便可以初步检测 应用是否存在内存泄露情况，比如说 内存曲线始终是逐步攀升的，通过观测几分钟后(Records 中应该会触发多次 GC，或者手动触发一次 GC)，内存使用情况依然居高不下，甚至是节节上升态，那么很有可能应用程序存在内存泄露。所以，可能下一步就需要  Profiles 面板的更精确的定位了。

那么正常情况下应该是什么样子呢，看下图，这是一个网页打开后在接近一分钟内的内存使用情况，可以看出常态基本拿捏于一个平缓的幅度中，只是在页面加载执行时内存使用会稍微多一些而已。

![timeline_10.jpg](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/timeline_10.jpg)


想要了解更详细一点的看官方的帮助：[Performance profiling with the Timeline](https://developer.chrome.com/devtools/docs/timeline) 。


## Profiles 面板

简而言之，通过它可以收集到程序运行时记录的函数调用的耗时和内存使用情况，来让我们更方便得了解程序的时间和空间消耗情况。早期这里也可以收集到 CSS 选择器生成 Render Tree 的情况，不过后来被移除了，因为在 Timeline 里通过查看 Style Recalculation 的信息来完成。

###  CPU Profile

在CPU Profile 下，可以看到函数的调用堆栈以及每个函数的性能。查看 DEMO，按一下操作流程开始。

1. 打开 DevTools，切换到 Profiles 之后选中 Collect Javascript  CPU Profile，点击 Start 开始录制
2. 戳页面中的 Run 按钮
3. 点 DevTools 中的 Stop 按钮，结束录制。

现在来看录制结果。

![profile_1.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/profile_1.png)

对比一下代码，其实有点点 console.trace(); 的意思。在 CPU Profiles 模式中，如上图，当选中划横线部分 Heavy(Bottom Up)后，展示出来的就是函数调用的堆栈信息。与之对应的，还有一个 Tree(Top Down)的选项，看字面意思，就是从顶向下了，应该知道是什么用途了吧，从函数调用堆栈的顶部向下开始展示函数的执行轨迹， 也就是断点调试的 step in的节奏。

还是看上图，图中显示的三列： Self，Total，Function。Self 和 Total 单位都为 ms，代表当前执行耗时，Function 指代目标函数名称。Self 是当前函数自身执行耗时，而 Total 的时间包括了当前函数调用以及它所调用其他函数的总耗时。

了解了 js 执行的耗时了，接下来应该看看占用的内存情况了。

### Heap profiler

简单说，它可以抓去一份当前页面的内存快照， 它包含了当前网页 js运行时用到的所有对象，相关 dom 节点的所使用的内存信息。

它能解决的问题是，我们可以通过对 js 内存的快照对比来分析排查当前网页哪里存在内存泄露，不要忘了 Timeline 的 Memory View 也是可以查看内存的使用情况，往往这两者是搭配使用，先用 Timeline 来查看是否有内存泄露，比如说内存是否一直是处于增长状态，DOM Node 的数量等。

下图是 Summary view 模式下的一个快照

![profile_2.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/profile_2.png)

从图中序号开始先了解一下各列的含义。

1. 这里列出了已经抓取到的快照列表，注意如果不想要了需要手动删除，刷新页面(关闭打开调试工具)依然会是保留的。
2. Constructor 显示出所有由该构造方法创建出来的对象
3. Distance 当前对象到 ROOT 的距离 (浏览器环境是 window, node 环境是 global)
4. Objects Count 对象个数
5. Shallow Size 对象自身持有的内存大小
6. Retained Size 对象包括它所引用的对象一共占的内存
7. 当前快照中所有对象持有的内存大小。注意是可访问到的 js 对象。
8. Class filter  快速过滤 构造方法
9. 过滤选项。我也没想好这里的准确名称，当有多个内存快照时，就可以通过更改这里对比两个内存快照的差异。

这里引用一下官方对**Shallow Size** 和 **Retained Size** 的解释来加深理解: [Memory Analysis 101](https://developer.chrome.com/devtools/docs/memory-analysis-101)

> The size of memory that is held by the object itself is called shallow size. Typical JavaScript objects have some memory reserved for their description and for storing immediate values.

> Usually, only arrays and strings can have significant shallow sizes. However, strings often have their main storage in renderer memory, exposing only a small wrapper object on the JavaScript heap.

> Nevertheless, even a small object can hold a large amount of memory indirectly, by preventing other objects from being disposed by the automatic garbage collection process. The size of memory that will be freed, when the object itself is deleted, and its dependent objects made unreachable from GC roots, is called retained size.

备注： 5 和 6 的单位都为 Byte.

以官方一个实际例子来看。[example4](https://developer.chrome.com/devtools/docs/demos/memory/example4)

打开页面，按一下步骤操作

1. 抓去一次快照，记为快照1
2. 点击*Create detached nodes*
3. 抓去一次快照，记为快照2
4. 点击 *Clean detached nodes*
5. 抓取一次快照，记为快照3

ok，操作结束。(因为我已经抓取过，所以我的图示例索引为 6，7，8)

现在来看第一次抓取到的快照，通过搜索快速定位到 DocumentFragment 搜索没结果；切换到快照2，可以看到有我们代码中创建的 DocumentFragment， Object Count 是 11 个，不用在乎最下面那一个，从它的数据也可以看出它不属于我们创建的，(Distance 是 4，Shallow Size 是16)。注意节点颜色是黄色的。

![profile_3.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/profile_3.png)

切换上图中提到的9过滤选项为Objects allocated between Snapshot 1 and 2 ,再来搜索 HtmlDivElement， 一共 500 个。

![profile_4.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/profile_4.png)

注意这里的背景颜色是红色的，普通情况下是没有背景色的。

插播一下， 红色和黄色背景标识的对象都代表 该节点是 Detached DOM tree 的一部分，但两者的区别在于红色 node 不存在直接的 javascript 对象引用，而黄色存在。

用一个官方示例的 gif 图来直观了解一下

![profile_detached-nodes.gif](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/profile_detached-nodes.gif)

回来看 点了*Clean detached nodes* 之后的内存快照 3，来验证一下对红色和黄色的理解。代码中

```javascript
frags.length = 0;
```

相当于已经切断了 节点与 js 对象之间的引用，红色和黄色所标识的节点应该都不会存在才对。

切换快照3的过滤选项到 Object allocated between Snapshoot 1 and 2(其实切换到其他的过滤选项也是可以的)，再通过搜索 documentfragment 或者 htmlDivElement 都没有我们创建的节点了。

![profile_6.png](https://raw.githubusercontent.com/yleo77/Notes/master/attachments/devtool/profile_6.png)

空空如也。

这个 Heap Profiles 里还有太多东西一一列举不到了（事实是我还没看到），想看时可以继续看 [JavaScript Memory Profiling](https://developer.chrome.com/devtools/docs/javascript-memory-profiling)。


##  Resource，Audits 面板

这两个面板好像都没什么可说的。一个是当前页面的相关资源，一个是给出优化建议。

## Console 面板

这个应该也属于用的非常非常多的一个面板。这里把 Console 提供的 api 结合 Command Line API 共同过一下，这两者的 api 有时候还是互通的。我只摘一些我经常用到或者感觉有可能用到的 api 列举一下，完整的请看官方文档。

Console 提供的功能不仅仅有 log，warn，error，还有很多，比如 assert，group(groupEnd)，time(timeEnd)，timeStamp，profile(profileEnd)

单列出两个， `count` 和 `trace`，前者统计某一段代码执行次数，后者可以打印出函数调用堆栈，调试时常用到，根据堆栈排查 bug 对前端来说也是一件容易的事儿。

Command Line API 里，

$0 , $1, $2, $3, $4   $0 指代 element 面板上当前选中的元素, $1 指代上一次选中的元素，依次类推。

$()  等价于 `document.querySelector`，$$() 是 `document.querySelectorAll`，$x() 则提供了 用 xpath 的方式访问 DOM  树的功能。

`getEventListeners` 获取给定对象上绑定的事件；`monitorEvents(object [,event])` 监听事件，事件触发后控制台会打出一条 log，比较有用的是 event 参数所支持的形式，比如 `monitorEvents(window, [“key"])` 当所有和按键有关的事件触发时都会打出 log。

全部的 api 看这里:  

* [Console API Reference](https://developer.chrome.com/devtools/docs/console-api) 
* [Command Line API Reference](https://developer.chrome.com/devtools/docs/commandline-api)

几个 trick

Source 面板中加了断点后，代码在中断执行模式下，此时 Console 里输入的代码执行上下文和断点所在的函数保持一致。

在 Console 里执行的代码一般是不能加断点的，有两种方法，一种是借助 Command Line API 提供的 debug 函数；一种是通过在所要执行的代码中加入 `//@ sourceURL=filename.js` ，此后就可以在 source 面板通过 filename 来找到这部分代码了，断点就可以随便打了。举个栗子，将以下代码放入 Console 里执行后，去看看 source 面板是不是多了一个叫 abc.js 的文件。

```javascript
function a(){}
//@ sourceURL=abc.js
```
借助这个特性，也就可以调试 localStorage 里的代码了， 每个保存在 localStorage 里的 js code 字符串末尾都加上 sourceURL 的 filename 映射，h5开发的代码很多都是保存在 localStorage 里，碰到问题想调试却无发 debug code 的 case 就解决了。

同借助这个特性，也就可以和其他普通的 js 文件一样，支持动态修改。

##  和设置相关

一个是右上角齿轮，一个是按 Esc 呼出的，定期看看，更新还是蛮快的，尤其是 Canary 版本。

最后，给自己一个建议，每隔两三个月打开一次 chrome 控制台的setting窗口，撸一遍设置/快捷键，其他工具也是类似了，想一气呵成记住很多亮眼的 feature，最后可能起反作用容易搞混，所以我一般都需要每过一定时期再来翻翻我常用的软件的设置窗口看看是不是有什么进阶的功能我应该能用到但还没用到的，或者去相关官网有没有新增加并且我认为对我有用的特性，以及会订阅一些关于该软件信息的 maillist。如果是这样的话，我就会择几个先记在 evernote 里，把它用起来，工具只有在用熟练之后，才能闪现出它的光芒。

## Resource

* [Evaluating network performance](https://developer.chrome.com/devtools/docs/network)
* [Chrome Devtools Cheatsheet](http://anti-code.com/devtools-cheatsheet/)
* [Styles that affect layout and paint](http://goo.gl/lPVJY6)
* [Tips And Tricks](https://developer.chrome.com/devtools/docs/tips-and-tricks)
* [Chrome Dev Tools - “Size” vs “Content”](http://stackoverflow.com/questions/8072921/chrome-dev-tools-size-vs-content)

EOF

