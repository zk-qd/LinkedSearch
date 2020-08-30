/**
 * 关联查询列表
 * @param {DOM} el inputdom元素
 * @param {Function} callback 回调函数获取接口数据
 * 1. 绑定事件 input blur focus 
 * 2. 初始化容器
 * 4. 销毁容器
 * 3. 筛选数据
 * 5. 渲染列表
 *  */
function LinkedList(el, callback) {
    this.el = el;
    this.el.parentElement.classList.add('linked-input-css');
    this.el.addEventListener('input', (event) => {
        let value = event.currentTarget.value;
        filterData(value).then(list => {
            console.log(list)
            render.call(this, list);
        });
    });
    this.el.addEventListener('focus', (event) => {
        let value = event.currentTarget.value;
        initial.call(this, value);
    });
    this.el.addEventListener('blur', (event) => {
        destory.call(this);
    });

    // 初始化
    function initial(value) {
        this.container = document.createElement('ul');
        this.container.classList.add('linked-ul-container');
        this.el.parentElement.appendChild(this.container);
        this.container.addEventListener('mousedown', (e) => {
            let target = e.target;
            if (target.tagName === 'LI') {
                this.el.value = target.innerText;
            }
        })
        filterData(value).then(list => {
            this.container.classList.add('linked-ul-transition');
            render.call(this, list);
        });
        
    }
    // 销毁
    function destory() {
        // this.container.classList.remove('linked-ul-down').add('linked-ul-up');
        this.container.remove();
    }
    /** 
     * *获取数据
     * @param {String} value input输入的数据,筛选接口请求接口筛选数据
     * 
     * 1. 如果是异步获取数据 callback为promise、函数
     * 2. 如果同步获取数据，
     *  */
    async function filterData(value) {
        let result = callback();
        if (Promise[Symbol.hasInstance](result)) {
            result = await result;
        }
        return result.filter(item => item.toString().toUpperCase().includes(value.toString().trim().toUpperCase()))
    }
    /** 生成li 并且添加到container中，
     * @param {Array} list 数据集合 
     * */
    function render(list) {
        let frag = document.createDocumentFragment();
        if(list.length==0) list.push('<div style="text-align: center;">无数据</div>');
        this.lis = list.map(item => {
            let li = document.createElement('li');
            li.innerHTML = item;
            frag.appendChild(li);
            return li;
        });
        this.container.innerHTML = '';
        this.container.appendChild(frag);
    }
};