import { useState, useEffect } from "react";
import { View, Text, Button, Picker, ScrollView } from "@tarojs/components";
import { axios } from 'taro-axios'
import Taro from "@tarojs/taro";
import { AtList, AtListItem, AtInput, AtMessage, AtForm } from "taro-ui";
import { apiDomain } from '../../../config/buildConfig'
import "./index.scss";

export default function Index() {
  const [dateSel, setDateSel] = useState("");
  const [dateSelEnd, setDateSelEnd] = useState("");
  const [value, setVal] = useState('')
  const [data, setData] = useState([])
  const [token, setToken] = useState('')
  const [pageIndex, setPageIndex] = useState(1);
  useEffect(()=>{
    Taro.getBackgroundFetchToken({
      success: res => {
      console.log('🚀 ~ file: index.jsx ~ line 19 ~ useEffect ~ res', res)
        if(res?.token){
          setToken(res?.token)
        } else {
          Taro.atMessage({
            'message': '请重新登录',
            'type': 'warning',
          })
          Taro.navigateTo({
            url: '/pages/index/index'
          })
        }
      },
      fail: res => {
        Taro.atMessage({
          'message': '请重新登录',
          'type': 'warning',
        })
        Taro.navigateTo({
          url: '/pages/index/index'
        })
      },
    })
  }, [])
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

  const scrollToLower =() => {
		handleSearch(pageIndex)
	}
  const search = () => handleSearch(pageIndex);
  async function handleSearch(index){
    const params = {
      scanNum: value,
      startDate: dateSel,
      endDate: dateSelEnd,
      pageNum: index,
      pageSize: 10
    }
    const res = await axios.get(`${apiDomain}/scan`,{
      params,
      headers: {
        authorization: token
      }});
    console.log('🚀 ~ file: index.jsx ~ line 58 ~ search ~ res', res)
    if(res?.data?.code === 0 && res?.data?.data?.scanItem.length !==0) {
      setData( prev => ([...prev, ...res?.data?.data?.scanItem]))
      setPageIndex( prev => (prev+ 1))
    }

  }
  return (
    <View className='mine'>
      <AtMessage />
      <AtForm>
      <AtInput
        name='scanId'
        title='被试编号'
        type='text'
        placeholder='被试编号'
        value={value}
        onChange={handleChangeVal}
      />
      <View className='mine_date_start'>
        <Picker mode='date' onChange={onDateChange}>
          <AtList>
            <AtListItem title='请选择开始日期' extraText={dateSel} />
          </AtList>
        </Picker>
      </View>
      <View className='mine_date_end'>
        <Picker mode='date' onChange={onDateChangeEnd}>
          <AtList>
            <AtListItem title='请选择结束日期' extraText={dateSelEnd} />
          </AtList>
        </Picker>
      </View>
      <View >
        <Button onClick={search} className='mine_search_button'>搜索</Button>
      </View>
      <ScrollView scrollY lowerThreshold={100} onScrollToLower={scrollToLower} style={{height: '100vw'}}  scrollWithAnimation>
        {data &&
        (data.map((item, index) => {
          return (<View className='mine_item_con' key={index}>
            <View>被试编号: {item.scanId}</View>
            <View>检测时间: {item.scanTime}</View>
            {item.scanItemPic.map((item2, index2) => {
              return <View key={index2}>长直径: {item2.length} 短直径: {item2.width} 面积: {item2.area}</View>
            })}
          </View>)
        }))}
      </ScrollView>
      </AtForm>
    </View>
  );
}
