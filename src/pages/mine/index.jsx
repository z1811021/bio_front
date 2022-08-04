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
  // const [value, setVal] = useState('')
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
  // function handleChangeVal(val) {
  //   console.log('🚀 ~ file: index.jsx ~ line 15 ~ handleChangeVal ~ val', val)
  //   setVal(val)
  // }
  function onDateChangeEnd(val) {
    console.log("🚀 ~ file: index.jsx ~ line 10 ~ onDateChange ~ val", val);
    setDateSelEnd(val.detail.value);
  }

  const scrollToLower =() => {
		handleSearch(pageIndex, false)
	}
  const search = () => handleSearch(pageIndex, true);
  async function handleSearch(index, isNewSearch){
    const params = {
      // scanNum: value,
      startDate: dateSel,
      endDate: dateSelEnd,
      pageNum: isNewSearch ? 1 : index,
      pageSize: 10
    }
    const res = await axios.get(`${apiDomain}/scan`,{
      params,
      headers: {
        authorization: token
      }});
    console.log('🚀 ~ file: index.jsx ~ line 58 ~ search ~ res', res)
    if(res?.data?.code === 0 && res?.data?.data?.list.length !==0) {
      isNewSearch ? setData(res?.data?.data?.list) : setData( prev => ([...prev, ...res?.data?.data?.list]))
      isNewSearch ? setPageIndex(2) : setPageIndex( prev => (prev+ 1))
    }

  }
  return (
    <View className='mine'>
      <AtMessage />
      <AtForm>
      {/* <AtInput
        name='scanId'
        title='被试编号'
        type='text'
        placeholder='被试编号'
        value={value}
        onChange={handleChangeVal}
      /> */}
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
      <ScrollView scrollY lowerThreshold={100} onScrollToLower={scrollToLower} style={{height: '125vw', marginTop: 10}}  scrollWithAnimation>
        {data &&
        (data.map((item, index) => {
          return (<View className='mine_item_con' key={index}>
            <View >扫描的编号: <Text>{item?.scanItemId || ''}</Text></View>
            <View >用户名: <Text>{item?.username || ''}</Text></View>
            <View >项目名称: <Text>{item?.projectName || ''}</Text></View>
            <View >项目期数: <Text>{item?.phase || ''}</Text></View>
            <View >被试人员编号: <Text>{item?.testeeName || ''}</Text></View>
            <View >检测时间: <Text>{item?.scanTime || ''}</Text></View>
            <View >手臂类型: <Text>{item.handType === 0 ? '未知' : item.handType === 1 ? '左手' : '右手'}</Text></View>
            <View >入组编号: <Text>{item?.entryGroupNum || ''}</Text></View>
            <View >药物编号: <Text>{item?.drugNum || ''}</Text></View>
            <View >注射日期: <Text>{item?.injectionDate || ''}</Text></View>
            <View >随访周期: <Text>{item?.followUpPeriod || ''}</Text></View>
            <View >皮肤红晕横径: <Text>{item?.skinBlushHorizontalDiameter}</Text></View>
            <View >皮肤红晕纵径: <Text>{item?.skinBlushVerticalDiameter}</Text></View>
            <View >皮肤硬结横径: <Text>{item?.skinCallusesHorizontalDiameter}</Text></View>
            <View >皮肤硬结纵径: <Text>{item?.skinCallusesVerticalDiameter}</Text></View>
          </View>)
        }))}
      </ScrollView>
      </AtForm>
    </View>
  );
}
