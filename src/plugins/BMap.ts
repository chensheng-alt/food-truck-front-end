import { IApi } from 'umi';

export default (api: IApi) => {
    api.describe({key: 'BaiDu Map plugin'});
    api.addHTMLScripts(() => [
        {
            // bai du map
            type: 'text/javascript',
            src: '//api.map.baidu.com/api?type=webgl&v=1.0&ak=gGBSDBXobMtVUzkfbZujVsQy'
        }
    ]);
}