import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import * as dayjs from 'dayjs'
import { axios } from 'taro-axios'
import compact from 'lodash/compact'
import { AtImagePicker , AtInput, AtMessage} from 'taro-ui'
import  { Fragment, useState, useEffect} from 'react'
import sleep from '../../utils/sleep'
import { apiDomain } from '../../../config/buildConfig'
import './index.scss'

export default function Index() {
    const [order, setOrder] = useState('')
    const [files, setFiles] = useState([])
    const [token, setToken] = useState('')
    const [info, setInfo] = useState([])
    const [scanOrder, setScanOrder] = useState('')
    const [userId, setUserId] = useState('')
    const [isLoading, setLoading] = useState(false)
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
        current: info[index].name, // 当前显示图片的http链接
        urls: [`${info[index].name}`] // 需要预览的图片http链接列表
      })
    }
    function onFail(mes) {
    console.log('🚀 ~ file: index.jsx ~ line 29 ~ onFail ~ mes', mes)
    }
    function backTest() {
      setInfo([])
    }
    async function submit() {
      const res = await axios.put(`${apiDomain}/scan/${scanOrder}`, {}, {
        withCredentials: false, // 跨域我们暂时 false
        headers: {
          authorization: token
        }});
      console.log('🚀 ~ file: index.jsx ~ line 93 ~ submit ~ res', res)
      if(res?.data?.code === 0){
        Taro.atMessage({
          'message': '提交成功',
          'type': 'success',
        })
        await sleep(2000);
        Taro.navigateTo({
          url: '/pages/home/index'
        })
      } else {
        Taro.atMessage({
          'message': '提交失败，请稍后重试',
          'type': 'warning',
        })
      }

    }
    async function getInfo() {
      if(order && files.length > 0) {
        setLoading(true)
        const  aliData = await getAliCloudInfo();
        // const  res = await uploadAliCloud(aliData, files, 0);
        let uploadTimeArr = files.map((item, index) =>{
          return  uploadAliCloud(aliData, files, index);
        })

        const statusesPromise = Promise.allSettled(uploadTimeArr);
        const statuses = await statusesPromise;

        const submitImgArr = statuses.map((item, index) => {
          return item.status === 'fulfilled' ? item.value : ''
        })
        // submit info
        const res = await axios.post(`${apiDomain}/scan`, {scanNum: order, pics: compact(submitImgArr)}, {
          withCredentials: false, // 跨域我们暂时 false
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            authorization: token
          }});
        if(res?.data?.code === 0) {
            setLoading(false)
            Taro.atMessage({
              'message': '提交成功',
              'type': 'success',
            })
            setInfo(res?.data?.data?.scanItemPic || {})
            setScanOrder(res?.data?.data?.scanId || '')
            setUserId(res?.data?.data?.userId || '')
        } else {
          setLoading(false)
            Taro.atMessage({
              'message': res?.data?.msg || '请稍后再试',
              'type': 'error',
            })
        }
      } else {
        Taro.atMessage({
          'message': '请上传照片和录入被试编号',
          'type': 'warn',
        })
      }
    }
    // get upload info para
    async function getAliCloudInfo(){
      const res = await axios.get(`${apiDomain}/policy`, {
        headers: {
          authorization: token
        }});

      if(res?.data?.code === 0 ) {

        return res.data.data
      } else {
        Taro.atMessage({
          'message': '登录过期， 请重新登录',
          'type': 'warn',
        })
        await sleep(1500);
        Taro.navigateTo({
          url: '/pages/index/index'
        })
        return
      }
    }
     // upload info Ali
    async function uploadAliCloud(aliData, pic, index){
      console.log('🚀 ~ file: index.jsx ~ line 152 ~ uploadAliCloud ~ aliData, files', aliData, pic)
      const {accessid, host, expire, signature, policy, dir, callback} = aliData
      const OSSAccessKeyId = accessid
      const success_action_status = '200'
      const imageName =  Taro.getStorageSync('username') + Date.now() + index +'system.png'
      console.log('🚀 ~ file: index.jsx ~ line 166 ~ uploadAliCloud ~ imageName', imageName)
      const key = dir + imageName
      const obj = {
        'key': key,
        'expire': expire,

        'callback': callback,
        'policy': policy,
        'OSSAccessKeyId': OSSAccessKeyId,
        'success_action_status': success_action_status,
        'signature': signature,
        // 'file': pic[index].file.path,
      }
      try {
        const uplaodRes = await Taro.uploadFile({
          url: host,
          filePath: pic[index].file.path,
          name: 'file',
          formData: obj,
          success (res){
            return res
          },
          fail(res) {
          }
        })
        if(JSON.parse(uplaodRes.data).code == 0) {
          return 'https://scan-bucket.oss-cn-chengdu.aliyuncs.com/scan/' + imageName
        } else {
          throw new Error(400);
        }
      } catch (error) {
          throw new Error(400);
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
          <Button className={order && files.length > 0 ? 'add_submit' : 'add_submit_empty'} onClick={getInfo} disabled={isLoading} loading={isLoading} style={isLoading ? {opacity: '.5'} : {}}> {isLoading ? '提交中...' : '提交' }</Button>
        </Fragment>
        ) : (
          <View className='add_order_list'>
            <Text className='add_order_list_title'>被试编号: <Text className='add_order_list_title_num'>{order}</Text></Text>
            <View className='add_order_list_space'></View>
            <Text className='add_order_list_title'>医生编号: <Text className='add_order_list_title_doctor'>{userId}</Text></Text>
            <View className='add_order_list_space'></View>
            {
              info.map((item, index) => {
                return (
                  <View className='add_order_list_item_con' key={index}>
                    <View className='add_order_list_space'></View>
                    <View className='add_order_list_item'>
                      <Image onClick={() => preview(index)} src={item.name} style={{width: '138px', height: '123px'}} />
                      <View className='add_order_list_title_con'>
                        <View>{dayjs.unix(item.timestamp).format('YYYY-MM-DD hh:mm:ss')}</View>
                        <View><Text className='add_order_list_title'>长直径: <Text className='add_order_list_title_content'>{item.length}</Text></Text></View>
                        <View><Text className='add_order_list_title'>短直径: <Text className='add_order_list_title_content'>{item.width}</Text></Text></View>
                        <View><Text className='add_order_list_title'>面积: <Text className='add_order_list_title_content'>{item.area}</Text></Text></View>
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
