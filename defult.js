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
