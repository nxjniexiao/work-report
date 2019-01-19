(function(angular) {
  angular.module("myApp", []).controller("myController", [
    "$scope",
    function($scope) {
      $scope.companiesArray = [
        {
          value: 2,
          children: [
            {
              value: 3,
              children: [
                {
                  value: 4596,
                  children: [
                    { value: 4592, label: "北京鎏庄" },
                    { value: 4593, label: "北京金丰" },
                    {
                      value: 4595,
                      label: "北京茂瑞"
                    }
                  ],
                  label: "丰台片区"
                },
                {
                  value: 4597,
                  children: [
                    { value: 4589, label: "金茂葛洲坝" },
                    { value: 4590, label: "北京亦城" },
                    {
                      value: 4591,
                      label: "北京拓赢"
                    }
                  ],
                  label: "亦庄片区"
                },
                {
                  value: 4599,
                  children: [
                    { value: 4588, label: "金茂融创" },
                    { value: 4594, label: "北京金盏" }
                  ],
                  label: "朝阳片区"
                },
                {
                  value: 48,
                  children: [
                    { value: 3604, label: "西海岸项目" },
                    { value: 50, label: "高新区一项目公司" },
                    {
                      value: 104,
                      label: "高新区二项目公司"
                    },
                    { value: 3466, label: "高新区三项目公司" },
                    { value: 51, label: "青岛蓝海" },
                    { value: 103, label: "青岛伊甸园" }
                  ],
                  label: "金茂青岛"
                },
                {
                  value: 112,
                  children: [
                    { value: 201, label: "一热电项目" },
                    { value: 196, label: "成湖项目" },
                    {
                      value: 197,
                      label: "小王庄项目"
                    },
                    { value: 4219, label: "刘园188项目" }
                  ],
                  label: "金茂天津"
                },
                { value: 133, label: "金茂郑州" },
                { value: 216, label: "金茂济南" }
              ],
              label: "金茂北京"
            },
            {
              value: 7,
              children: [
                { value: 9, label: "长沙投资" },
                { value: 88, label: "长沙研发" },
                {
                  value: 13,
                  label: "长沙盛荣"
                },
                { value: 11, label: "长沙金悦" },
                { value: 10, label: "长沙广场" },
                { value: 12, label: "长沙城开" },
                {
                  value: 113,
                  label: "长沙乾璟"
                },
                {
                  value: 148,
                  children: [
                    { value: 140, label: "武汉首茂城" },
                    { value: 149, label: "武汉安和盛泰" },
                    {
                      value: 3563,
                      label: "武汉华璋"
                    },
                    { value: 4090, label: "武汉启茂" },
                    { value: 4097, label: "武汉化资" },
                    { value: 4098, label: "武汉兴茂" }
                  ],
                  label: "金茂武汉"
                },
                { value: 3335, label: "金茂南昌" }
              ],
              label: "金茂长沙"
            },
            {
              value: 18,
              children: [
                {
                  value: 4480,
                  children: [{ value: 3336, label: "路劲·金茂嘉禾金茂府" }],
                  label: "金茂上海环沪事业部"
                },
                {
                  value: 20,
                  children: [{ value: 198, label: "宁波宁兴公司" }],
                  label: "金茂宁波"
                },
                {
                  value: 22,
                  children: [
                    { value: 120, label: "首开金茂" },
                    { value: 215, label: "杭州兴茂" }
                  ],
                  label: "金茂杭州"
                },
                {
                  value: 21,
                  children: [
                    { value: 3648, label: "苏州屿秀房地产开发有限公司" },
                    { value: 3518, label: "苏州腾茂置业有限公司" },
                    {
                      value: 163,
                      label: "浒墅关项目公司"
                    },
                    { value: 164, label: "科技城项目公司" }
                  ],
                  label: "金茂苏州"
                },
                { value: 136, label: "嘉定项目" },
                { value: 137, label: "广粤路项目" },
                {
                  value: 194,
                  label: "金茂温州"
                },
                { value: 30, label: "上海航运" },
                { value: 144, label: "上海茂秀" },
                { value: 202, label: "上海坤茂" }
              ],
              label: "金茂上海"
            },
            {
              value: 6,
              children: [
                { value: 56, label: "广州公司" },
                { value: 87, label: "佛山公司" },
                {
                  value: 114,
                  label: "深圳公司"
                },
                { value: 145, label: "福州公司" },
                { value: 200, label: "厦门公司" },
                {
                  value: 139,
                  label: "珠海公司"
                },
                { value: 4004, label: "泉州公司" }
              ],
              label: "金茂广州"
            },
            {
              value: 27,
              children: [
                { value: 44, label: "珑悦项目" },
                { value: 45, label: "盘龙项目" },
                {
                  value: 46,
                  label: "空港项目"
                },
                { value: 166, label: "龙兴项目" },
                { value: 191, label: "礼嘉项目" },
                {
                  value: 4328,
                  label: "中央公园南项目"
                },
                {
                  value: 158,
                  children: [
                    { value: 165, label: "武侯项目" },
                    { value: 4373, label: "金堂项目" }
                  ],
                  label: "金茂成都"
                },
                {
                  value: 3649,
                  children: [{ value: 4440, label: "贵阳白云项目" }],
                  label: "金茂贵阳"
                },
                {
                  value: 25,
                  label: "金茂丽江"
                }
              ],
              label: "金茂重庆"
            },
            {
              value: 4598,
              children: [
                { value: 4374, label: "金茂南通" },
                { value: 3625, label: "金茂徐州" },
                {
                  value: 129,
                  label: "金茂合肥"
                },
                { value: 3776, label: "上坊片区" },
                { value: 3777, label: "河西片区" },
                {
                  value: 203,
                  children: [
                    { value: 204, label: "梅村项目公司" },
                    { value: 207, label: "锡北项目公司" },
                    {
                      value: 91,
                      label: "蠡湖金茂府项目公司"
                    }
                  ],
                  label: "金茂无锡"
                },
                { value: 205, label: "江北综合体项目公司" },
                { value: 3817, label: "金茂常州" },
                {
                  value: 3818,
                  label: "高淳项目公司"
                },
                { value: 153, label: "河西综合体项目公司" },
                { value: 24, label: "南京国际" },
                { value: 213, label: "汤山项目公司" }
              ],
              label: "金茂南京"
            },
            {
              value: 23,
              children: [
                { value: 3433, label: "酒店管理公司" },
                { value: 52, label: "上海物业" },
                {
                  value: 55,
                  label: "金茂锦江"
                }
              ],
              label: "金茂酒店"
            },
            {
              value: 14,
              children: [
                { value: 4212, label: "上海J·LIFE" },
                { value: 16, label: "丽江J·LIFE" },
                {
                  value: 57,
                  label: "南京金茂汇"
                },
                { value: 15, label: "长沙览秀城" },
                { value: 4220, label: "重庆珑悦里" },
                {
                  value: 17,
                  label: "青岛金茂湾购物中心"
                },
                { value: 4213, label: "上海北外滩J·LIFE" }
              ],
              label: "金茂商业"
            },
            {
              value: 42,
              children: [
                { value: 3860, label: "工程公司" },
                { value: 3862, label: "经营公司" },
                {
                  value: 121,
                  label: "会所系统"
                },
                { value: 123, label: "写字楼管理中心" },
                { value: 122, label: "外委项目-管理中心" },
                {
                  value: 124,
                  label: "北京-中心城市公司"
                },
                { value: 125, label: "上海-中心城市公司" },
                { value: 126, label: "广州-中心城市公司" },
                {
                  value: 127,
                  label: "长沙-中心城市公司"
                },
                { value: 128, label: "重庆-中心城市公司" }
              ],
              label: "物业事业部"
            },
            { value: 40, label: "金茂装饰" },
            {
              value: 105,
              children: [
                { value: 3855, label: "北京中电恒通建设工程有限公司" },
                { value: 206, label: "湖南新茂智慧能源有限公司" }
              ],
              label: "金茂绿建"
            },
            { value: 131, label: "金茂资本" },
            { value: 210, label: "金茂西安" },
            {
              value: 3524,
              label: "金茂三亚"
            },
            { value: 4479, label: "金茂太原（筹）" }
          ],
          label: "中国金茂"
        }
      ];
      $scope.selectedCompany = {
        value: 2,
        label: "中国金茂"
      };
    }
  ]);
})(window.angular);
