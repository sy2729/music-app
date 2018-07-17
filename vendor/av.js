{
    let { Query, User } = AV;
    let APP_ID = 'o6AtKb0QWCL0e52bUidS40IA-gzGzoHsz';
    let APP_KEY = 'Stk2iPeLcdiMufViDl2yqRCw';
    AV.init({
        appId: APP_ID,
        appKey: APP_KEY,
        // 启用美国节点
        // region: 'us'
    });

    // var User = AV.Object.extend('user');
    //     var user = new User();
    //     user.save({
    //         users: {name: 'sdas', age: 123, songListId: ['12313', '1212313']}
    //     }).then(function (object) {
    //         alert('LeanCloud Rocks!');
    //     })
}