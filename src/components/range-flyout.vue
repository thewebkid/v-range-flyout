<template>
  <div :class="wrapperClass" class="range-flyout-wrapper">
    <input ref="rangeInput" type="number" :min="min" :max="max"
           v-model="curVal" :class="inputClass"
           @focus="focus" @blur="blurred" @change="change"
           @keyup.up="selectValue" @keyup.down="selectValue"/>
    <transition name="slide-fade">
      <div class="flyout" :class="flyoutClass" v-if="active && !hideFlyout">
        <label>{{max}}</label>
        <div class="inner" :style="{height: sldHeight+'px',background:slideBackground}" @mousedown="slideClick($event)">
          <movable :bounds="{x:[0,0],y:bounds}" :onmove="moved" :oncomplete="complete" :grid="gridSize" :pos-top="startY" :style="{background:handleBg}" />
        </div>
        <label>{{min}}</label>
      </div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue';
  import movable from 'v-movable';
  Vue.use(movable);

  const getPrecision = a => {
    let e = 1;
    while (Math.round(a * e) / e !== a) e *= 10;
    return Math.log(e) / Math.LN10;
  };
  export default {
    //components:{movable},
    data:()=>{
      return {
        active:false,
        curVal:0,
        pctY:0,
        startY:0,
        delayBlur:false
      }
    },
    computed:{

      range(){
        return this.max-this.min;
      },
      bounds(){
        return [0-this.startY,this.sldHeight-this.startY]
      },
      sldHeight(){
        if (this.sliderHeight && this.sliderHeight > 12){
          return this.sliderHeight;
        }
        if (this.incr){
          return this.range/this.incr;
        }
        return this.max - this.min;
      },
      incrSize(){
        if (this.incr){
          return this.incr;
        }else{
          let inc = this.range / this.sldHeight;
          if (inc % 1===0){
            return inc;
          }
          return this.range >= this.sldHeight ? Math.round(inc) : 1;
        }
      },
      gridSize(){
        let incrPct = this.incrSize/this.range;
        return Math.max(1,Math.round(this.sldHeight * incrPct));
      }
    },
    name: 'v-range-flyout',
    props: [
      'inputClass',
      'wrapperClass',
      'flyoutClass',
      'min',
      'max',
      'sliderHeight',
      'slideBackground',
      'handleBg',
      'val',
      'incr',
      'hideFlyout'
    ],
    methods:{
      slideClick(e){
        this.noBlur = true;
        if (e.target.classList.contains('inner')){
          this.moved({pctY:e.offsetY/this.sldHeight})
        }
        setTimeout(()=>{
          this.selectValue();
          this.noBlur = false;
        },333);

      },
      blurred(e){
        if (this.noBlur) {
          return;
        }
        this.active = false;
        this.$emit('active', false);
      },
      focus(e){
        this.active = true;
        this.$emit('active', true);
      },
      selectValue(){
        const el = this.$refs.rangeInput;
        Vue.nextTick().then(()=>el.select());
        this.$emit('change',this.curVal);
      },
      moved({pctY}){
        let y = 1 - pctY;
        this.precisionVal(this.range * y);
        this.selectValue();
      },
      complete({pctY}){
        /*this.pctY = 1 - pctY;
        this.startY = this.sldHeight * this.pctY;*/
      },
      change(){
        this.pctY = 1-((this.curVal - this.min) / this.range);
        this.startY = Math.round(this.sldHeight * this.pctY);
        this.$emit('change',this.curVal);
      },
      precisionVal(v1){
        let pw = Math.pow(10,getPrecision(this.incrSize));
        let v2 = v1 * pw;
        let i2 = this.incrSize * pw;
        let v = Math.round(v2 / i2) * i2;//nearest increment
        this.curVal = Math.min(this.max, this.min + (v / pw));
      },
      init(){
        this.curVal = Number(this.val);
        this.change();
      }
    },
    mounted(){
      this.init();
    },
    watch:{
      val(){
        this.init();
      }
    }
  }
</script>

<style lang="scss" scoped>
  input[type=number]{
    display: inline-block;
    width: auto;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s linear;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .flyout{
    position:absolute;
    margin-left:-4px;
    background:#f7f7f7;
    display: inline-block;
    box-shadow: 0 0 5px #888;

    .inner{
      .--movable-base{
        background:lightblue;
        cursor: pointer;
        &:hover{
          background:deepskyblue;
        }
        display:inline-block;
        height:12px;
        width:16px;
        margin:-6px -6px;
        border-radius:3px;
        border:solid 1px dodgerblue;
      }
      width:6px;
      box-shadow: inset 0 0 5px #999, 1px 1px .5px #ccc;
      //border:outset 1px #aaa;
      //background:#eee;
      display: block;
      margin-left:-4px;
      left:50%;
      position: relative;
    }
    label{
      display: block;
      padding:7px 15px 3px 11px;
      text-align: center;
    }
  }
</style>
