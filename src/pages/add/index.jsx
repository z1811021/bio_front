import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtImagePicker , AtInput, AtMessage} from 'taro-ui'
import  { Fragment, useState, useEffect} from 'react'
import sleep from '../../utils/sleep'
import './index.scss'

export default function Index() {
    const [order, setOrder] = useState('')
    const [files, setFiles] = useState([])
    // todo remove value keep []
    const [info, setInfo] = useState([])
    function takePhoto() {
      // 只允许从相机扫码
      Taro.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          setOrder(res.result)
        }
      })
    }
    function onChangeImage(val) {
      if(val.length > 3) {
        Taro.atMessage({
          'message': '不能上传超过三张图片',
          'type': 'warning',
        })
        return
      }
      setFiles(val)
      console.log('🚀 ~ file: index.jsx ~ line 31 ~ onChangeImage ~ val', val)
    }
    function onImageClick(index, file) {
      Taro.previewImage({
        current: file.file.path, // 当前显示图片的http链接
        urls: [`${file.file.path}`] // 需要预览的图片http链接列表
      })
      console.log('🚀 ~ file: index.jsx ~ line 29 ~ onChangeImage ~ val', index)
      console.log('🚀 ~ file: index.jsx ~ line 25 ~ onImageClick ~ file', file)
    }
    function preview(index) {
      Taro.previewImage({
        current: info[index].imageUrl, // 当前显示图片的http链接
        urls: [`${info[index].imageUrl}`] // 需要预览的图片http链接列表
      })
    }
    function onFail(mes) {
    console.log('🚀 ~ file: index.jsx ~ line 29 ~ onFail ~ mes', mes)
    }
    function backTest() {
      setInfo([])
    }
    async function submit() {
      // todo
      Taro.atMessage({
        'message': '提交成功',
        'type': 'success',
      })
      await sleep(2000);
      Taro.navigateTo({
        url: '/pages/home/index'
      })
    }
    async function getInfo() {
      if(order && files.length > 0) {
        // todo api
        Taro.atMessage({
          'message': '提交成功',
          'type': 'success',
        })
        setInfo([{
          time: '2022.4.25 17:02:32',
          square: '2.21 cm',
          height: '2.21 cm',
          width: '2.21 cm2',
          imageUrl: 'https://img02.mockplus.cn/image/2022-04-24/7a76be30-c3d7-11ec-a807-7d3271559b2e.jpg'
        },{
          time: '2022.4.25 17:02:32',
          square: '2.21 cm',
          height: '2.21 cm',
          width: '2.21 cm2',
          imageUrl: 'https://img02.mockplus.cn/image/2022-04-24/7a76be30-c3d7-11ec-a807-7d3271559b2e.jpg'
        },{
          time: '2022.4.25 17:02:32',
          square: '2.21 cm',
          height: '2.21 cm',
          width: '2.21 cm2',
          imageUrl: 'https://img02.mockplus.cn/image/2022-04-24/7a76be30-c3d7-11ec-a807-7d3271559b2e.jpg'
        }])
      } else {
        Taro.atMessage({
          'message': '请上传照片和录入被试编号',
          'type': 'warn',
        })
      }
    }
    function changeVal(val){
      console.log('🚀 ~ file: index.jsx ~ line 98 ~ changeVal ~ val', val)
      setOrder(val)
    }
    return (
      <View className='add'>
        <AtMessage />
        {info.length === 0 ? (
          <Fragment>
            <View className='add_order'>
            <AtInput
              title='被试编号'
              type='text'
              placeholder='请通过相机扫描'
              value={order}
              onChange={val => changeVal(val)}
              className='add_order_input'
            />
            <Button className='photo_button' onClick={takePhoto}>拍照识别</Button>
          </View>
          <AtImagePicker
            length={3}
            multiple
            files={files}
            onChange={val => onChangeImage(val)}
            onFail={mes => onFail(mes)}
            onImageClick={(index, file) => onImageClick(index, file)}
          />
          <Button className={order && files.length > 0 ? 'add_submit' : 'add_submit_empty'} onClick={getInfo}> 提交 </Button>
        </Fragment>
        ) : (
          <View className='add_order_list'>
            <Text className='add_order_list_title'>被试编号: <Text className='add_order_list_title_num'>2132131</Text></Text>
            <View className='add_order_list_space'></View>
            <Text className='add_order_list_title'>医生编号: <Text className='add_order_list_title_doctor'>123213123</Text></Text>
            <View className='add_order_list_space'></View>
            {
              info.map((item, index) => {
                return (
                  <View className='add_order_list_item_con' key={index}>
                    <View className='add_order_list_space'></View>
                    <View className='add_order_list_item'>
                      <Image onClick={() => preview(index)} src={item.imageUrl} style={{width: '138px', height: '123px'}} />
                      <View className='add_order_list_title_con'>
                        <View>{item.time}</View>
                        <View><Text className='add_order_list_title'>长直径: <Text className='add_order_list_title_content'>{item.height}</Text></Text></View>
                        <View><Text className='add_order_list_title'>短直径: <Text className='add_order_list_title_content'>{item.width}</Text></Text></View>
                        <View><Text className='add_order_list_title'>面积: <Text className='add_order_list_title_content'>{item.square}</Text></Text></View>
                      </View>
                    </View>
                  </View>
                )
              })
            }
            <View className='add_order_list_button'>
              <Button className='add_order_list_button_back' onClick={backTest}>返回重测</Button>
              <Button className='add_order_list_button_submit' onClick={submit}>确认</Button>
            </View>
          </View>
        )}

      </View>
    )

}
