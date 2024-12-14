
document.addEventListener("DOMContentLoaded", function() {
    // 在 <head> 标签中插入 <link> 和 <script> 标签
    var head = document.getElementsByTagName('head')[0];
    

    
    // 创建 <script> 标签并设置 src 属性
    var script1 = document.createElement('script');
    script1.src = 'highlight.js';
    
    // 当 highlight.js 加载完成后，初始化 highlight.js
    script1.onload = function() {
        var script2 = document.createElement('script');
        script2.innerHTML = 'hljs.initHighlightingOnLoad();';
        document.body.appendChild(script2);  // 将初始化脚本插入到 <body> 标签中
    };
    
    head.appendChild(script1);
});
  



document.addEventListener("DOMContentLoaded", function() {
    const toc = document.createElement("div");
    toc.id = "toc";
    toc.innerHTML = "<h1>目录</h1>";
    document.body.insertBefore(toc, document.body.firstChild);

    const headers = document.querySelectorAll("h2, h3, h4, h5, h6");
    let tocContent = "";
    let numbering = [0, 0, 0, 0, 0];
    let lastLevel = 1;
    let tocItems = [];

    headers.forEach(header => {
        const level = parseInt(header.tagName.substring(1));
        if (level > lastLevel) {
            numbering[level - 1]++;
        } else if (level === lastLevel) {
            numbering[level - 1]++;
        } else {
            numbering[level - 1]++;
            for (let i = level; i < numbering.length; i++) {
                numbering[i] = 0;
            }
        }
        lastLevel = level;

        const num = numbering.slice(0, level + 1).filter(n => n > 0).join(".");
        const id = `toc-${num.replace(/\./g, "-")}`;
        header.id = id;

        tocItems.push({
            level: level,
            num: num,
            text: header.textContent,
            id: id
        });
    });

    tocItems.forEach((item, index) => {
        const nextItem = tocItems[index + 1];
        const hasChildren = nextItem && nextItem.level > item.level;
        const toggleSymbol = hasChildren ? "▷" : "◦";

        tocContent += `<div class="toc-item toc-level-${item.level}" style="display: ${item.level === 2 ? 'block' : 'none'};">
            <span class="toc-toggle">${toggleSymbol}</span>
            <a href="#${item.id}">${item.num} ${item.text}</a>
            <div class="toc-children"></div>
        </div>`;
    });

    toc.innerHTML += tocContent;

    document.querySelectorAll(".toc-toggle").forEach(toggle => {
        toggle.addEventListener("click", function() {
            const currentLevel = parseInt(this.parentElement.className.match(/toc-level-(\d)/)[1]);
            const currentNum = this.nextElementSibling.textContent.split(" ")[0];
            const children = document.querySelectorAll(`.toc-item`);
            children.forEach(child => {
                const childLevel = parseInt(child.className.match(/toc-level-(\d)/)[1]);
                const childNum = child.querySelector("a").textContent.split(" ")[0];
                if (childNum.startsWith(currentNum) && childLevel > currentLevel) {
                    if (childLevel === currentLevel + 1) {
                        if (child.style.display === "none" || !child.style.display) {
                            child.style.display = "block";
                            this.textContent = "▽";
                        } else {
                            child.style.display = "none";
                            this.textContent = "▷";
                        }
                    } else {
                        child.style.display = "none";
                    }
                }
            });

            document.querySelectorAll(".toc-toggle").forEach(toggle => {
                const toggleLevel = parseInt(toggle.parentElement.className.match(/toc-level-(\d)/)[1]);
                const toggleNum = toggle.nextElementSibling.textContent.split(" ")[0];
                const hasDirectChildren = Array.from(document.querySelectorAll(`.toc-item`)).some(child => {
                    const childLevel = parseInt(child.className.match(/toc-level-(\d)/)[1]);
                    const childNum = child.querySelector("a").textContent.split(" ")[0];
                    return childNum.startsWith(toggleNum) && childLevel === toggleLevel + 1;
                });
                if (toggleLevel > currentLevel) {
                    toggle.textContent = hasDirectChildren ? "▷" : "◦";
                }
            });
        });
    });

    headers.forEach(header => {
        header.addEventListener("click", function() {
            document.getElementById("toc").scrollIntoView();
        });
    });
});



// 创建模态框并将其添加到 body 中
var modal = document.createElement('div');
modal.classList.add('modal');
document.body.appendChild(modal);

// 创建模态框中的图片元素
var modalImage = document.createElement('img');
modalImage.classList.add('modal-image');
modal.appendChild(modalImage);

// 为所有图片添加点击事件
document.querySelectorAll('img:not(.modal-image)').forEach(function(image) {
    image.addEventListener('click', function() {
        modal.style.display = 'flex';  // 显示模态框
        modalImage.src = image.src;   // 设置模态框中的图片为点击的图片
        resetImage();  // 重置图片位置和缩放
    });
});


// 创建并添加关闭按钮
var closeButton = document.createElement('div');
closeButton.classList.add('close-button');  // 应用 CSS 中定义的类
modal.appendChild(closeButton);

// 给关闭按钮添加点击事件
closeButton.addEventListener('click', function() {
    modal.style.display = 'none';  // 隐藏模态框
    resetImage();  // 重置图片位置和缩放
});




// 声明拖动状态相关的变量
var isDragging = false;  // 标记是否正在拖动
var startX, startY;      // 鼠标按下时的坐标
var offsetX = 0, offsetY = 0;  // 当前图片的偏移量
var scale = 1;  // 图片缩放比例

// 鼠标按下事件：开启拖动模式
modalImage.addEventListener('mousedown', function(event) {
    isDragging = true;             // 启动拖动
    startX = event.clientX;        // 获取鼠标按下时的 X 坐标
    startY = event.clientY;        // 获取鼠标按下时的 Y 坐标
    modalImage.style.cursor = 'grabbing';  // 改变光标为抓取状态
    event.preventDefault();
});

// 鼠标移动事件：在按下鼠标的情况下拖动图片
modalImage.addEventListener('mousemove', function(event) {
    if (isDragging) {
        offsetX += event.clientX - startX;  // 更新偏移量
        offsetY += event.clientY - startY;  // 更新偏移量
        modalImage.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;  // 更新图片位置
        startX = event.clientX;  // 更新鼠标位置
        startY = event.clientY;  // 更新鼠标位置
    }
});

// 鼠标松开事件：结束拖动模式
modalImage.addEventListener('mouseup', function() {
    isDragging = false;  // 停止拖动
    modalImage.style.cursor = 'grab';  // 恢复光标为抓取状态
});

// 鼠标离开事件：防止鼠标离开时图片继续移动
modalImage.addEventListener('mouseleave', function() {
    isDragging = false;  // 停止拖动
    modalImage.style.cursor = 'grab';  // 恢复光标为抓取状态
});

// 双击图片时重置图片
modalImage.addEventListener('dblclick', resetImage);

// 重置图片的缩放和位移状态
function resetImage() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    modalImage.style.transform = `scale(1) translate(0, 0)`;  // 重置缩放和位置
}

// 鼠标滚轮事件：控制图片缩放
modalImage.addEventListener('wheel', function(event) {
    event.preventDefault();  // 防止页面滚动
    if (event.deltaY < 0) {
        // 放大
        scale += 0.1;
    } else {
        // 缩小
        scale -= 0.1;
        if (scale < 1) scale = 1;  // 限制最小比例为 1
    }
    modalImage.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;  // 更新缩放
});
