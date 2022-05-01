import { useState, useEffect } from "react";
import { View, Text, Button, Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtList, AtListItem, AtInput, AtMessage, AtForm } from "taro-ui";
import "./index.scss";

export default function Index() {
  const [dateSel, setDateSel] = useState("");
  const [dateSelEnd, setDateSelEnd] = useState("");
  const [value, setVal] = useState('')
  const [data, setData] = useState([])
  function onDateChange(val) {
    console.log("🚀 ~ file: index.jsx ~ line 10 ~ onDateChange ~ val", val);
    setDateSel(val.detail.value);
  }
  function handleChangeVal(val) {
    console.log('🚀 ~ file: index.jsx ~ line 15 ~ handleChangeVal ~ val', val)
    setVal(val)
  }
  function onDateChangeEnd(val) {
    console.log("🚀 ~ file: index.jsx ~ line 10 ~ onDateChange ~ val", val);
    setDateSelEnd(val.detail.value);
  }
  function search(){
      // todo
    setData([{
      order: 'CD21312',
      time: '2022.4.25 17:02:32',
      order1: {  square: '2.21 ',
      height: '2.21 ',
      width: '2.21 '},
      order2:{  square: '2.21 cm',
      height: '2.21 ',
      width: '2.21 '},
      order3:{  square: '2.21 cm',
      height: '2.21 ',
      width: '2.21 '}
    },{
      order: 'CD21312',
      time: '2022.4.25 17:02:32',
      order1: {  square: '2.21 cm',
      height: '2.21 ',
      width: '2.21 '},
      order2:{  square: '2.21 cm',
      height: '2.21 ',
      width: '2.21 '},
      order3:{  square: '2.21 cm',
      height: '2.21 ',
      width: '2.21 '}
    }])
  }
  return (
    <View className='mine'>
      <AtInput
        name='order'
        title='被试编号'
        type='text'
        placeholder='被试编号'
        value={value}
        onChange={handleChangeVal}
      />
      <View className='mine_date'>
        <Text>开始日期</Text>
        <Picker mode='date' onChange={onDateChange}>
          <AtList>
            <AtListItem title='请选择日期' extraText={dateSel} />
          </AtList>
        </Picker>
      </View>
      <View className='mine_date'>
        <Text>结束日期</Text>
        <Picker mode='date' onChange={onDateChangeEnd}>
          <AtList>
            <AtListItem title='请选择日期' extraText={dateSelEnd} />
          </AtList>
        </Picker>
      </View>
      <View >
        <Button onClick={search} className='mine_search_button'>搜索</Button>
      </View>
      {data &&
      (data.map((item, index) => {
        return (<View className='mine_item_con' key={index}>
          <View>被试编号: {item.order}</View>
          <View>检测时间: {item.time}</View>
          <View>长直径: {item.order1.width} 短直径: {item.order1.height} 面积: {item.order1.square}</View>
          <View>长直径: {item.order2.width} 短直径: {item.order2.height} 面积: {item.order2.square}</View>
          <View>长直径: {item.order3.width} 短直径: {item.order3.height} 面积: {item.order3.square}</View>
        </View>)
      }))}
    </View>
  );
}
