用于新建、修改会议的函数(580行)
```js
//会议添加或更新   0 不验证占用情况  否则验证
$scope.addOrUpdate = function(isValidate) {
  if ($scope.isMixed == 0) {
    $scope.meeting.capacity = 0;
  }
  delete $scope.meeting.isMixed;
  delete MeetingReserve.isMixed;
  //验证密码是否为数字
  $scope.checkPassword();
  //判断是否需要强制会议密码
  if (
    $scope.globalConfig.IS_NEED_PWD == 0 &&
    ($scope.meeting.password == '' || $scope.meeting.password == undefined)
  ) {
    if ($scope.meeting.type == 0) {
      logger.logWarning($rootScope.data.enterMeetingPassword);
      return;
    }
  }
  //判断自定义会议号是否匹配模板规则
  if (!!$scope.meeting.numericSuffix) {
    var split1 = $scope.meeting.numericPrefix.split('');
    var split2 = $scope.meeting.numericSuffix.split('');
    if (split2[0] == 0) {
      logger.logWarning($rootScope.data.customizeNUmberTemplate2);
      return;
    }
    for (var i = 0; i < split1.length; i++) {
      if (split1[i] != '*' && split2[i] != split1[i]) {
        logger.logWarning($rootScope.data.customizeNUmberTemplate);
        return;
      }
    }
    $scope.meeting.numericId = $scope.meeting.numericSuffix;
  } else {
    $scope.meeting.numericId = '';
  }
  delete $scope.meeting.bandwidthObject;
  delete $scope.meeting.categoriesObject;
  delete $scope.meeting.meetingtagObject;
  delete $scope.meeting.qualitymainObject;
  delete $scope.meeting.qualitypresentationObject;
  $scope.max_uuids();
  $scope.loading_box = true;

  //判断选择的会议室是否超过最大方数
  if (!MeetingReserve.uuid) {
    //创建会议
    //判断是否永久会议或者立即会议
    if ($scope.meeting.is_forever == 1) {
      //a 永久会议
      //将数据设置为默认值
      $scope.resetForForever($scope.meeting);
      MeetingService.foreverMeeting(
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            $scope.loading_box = false;
            if (data.status == 1000303) {
              logger.logWarning($rootScope.data.mcuConfigError);
            } else {
              logger.logWarning(data.message);
            }
          }
        }
      );
    } else if ($scope.meeting.is_foreverOrNow == 1 && $scope.isMixed != 1) {
      //b 立即视频会议
      //判断最大方是否开启，并且会议室是否超过最大方限制
      if (
        $scope.approve.max_attend_inuse != '0' &&
        $scope.login_user.roleId != '1' &&
        $scope.meeting.meetingRoomUuids.length > $scope.login_user.max_attend
      ) {
        logger.logWarning($rootScope.data.chooseMeetingRoom);
        $scope.loading_box = false;
        $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
        $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
        return;
      }
      //判断会议时长限制是否开启，并且会议时长超过设定时长
      if (
        $scope.approve.max_time != '-1' &&
        $scope.login_user.roleId != '1' &&
        ($scope.hours > $scope.approve.max_time ||
          ($scope.minutes > 0 && $scope.hours == $scope.approve.max_time))
      ) {
        logger.logWarning($rootScope.data.meetingTimeLength);
        $scope.loading_box = false;
        $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
        $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
        return;
      }
      var is_foreverOrNow = $scope.meeting.is_foreverOrNow;
      //将数据设置为默认值
      //	$scope.resetForForever($scope.meeting);
      $scope.meeting.is_foreverOrNow = is_foreverOrNow;
      $scope.meeting.startTime = new Date();
      MeetingService.nowMeeting(
        { isValidate: isValidate },
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 10026) {
            $scope.loading_box = false;
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            var indexModal = layer.confirm(
              $rootScope.data.conferenceConflict,
              {
                btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
              },
              function() {
                $scope.addOrUpdate(0);
                layer.close(indexModal);
              },
              function() {
                console.log('cancel');
              }
            );
          } else if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            // console.log(data);
            $scope.loading_box = false;
            if (data.status == 10027) {
              $('#template_decs').modal('show');
              $scope.meetingRoomLists = data.data;
              console.log(data);
            } else if (data.status == 10034) {
              logger.logWarning($rootScope.data.resetMeeting);
            } else if (data.status == 1000303) {
              logger.logWarning($rootScope.data.mcuConfigError);
            } else {
              logger.logError(data.message);
            }
          }
        }
      );
    } else if ($scope.meeting.is_foreverOrNow == 1 && $scope.isMixed == 1) {
      //混合会议立即开始
      //判断最大方是否开启，并且会议室是否超过最大方限制
      if (
        $scope.approve.max_attend_inuse != '0' &&
        $scope.login_user.roleId != '1' &&
        $scope.meeting.meetingRoomUuids.length > $scope.login_user.max_attend
      ) {
        logger.logWarning($rootScope.data.chooseMeetingRoom);
        $scope.loading_box = false;
        $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
        $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
        return;
      }
      //判断会议时长限制是否开启，并且会议时长超过设定时长
      if (
        $scope.approve.max_time != '-1' &&
        $scope.login_user.roleId != '1' &&
        ($scope.hours > $scope.approve.max_time ||
          ($scope.minutes > 0 && $scope.hours == $scope.approve.max_time))
      ) {
        logger.logWarning($rootScope.data.meetingTimeLength);
        $scope.loading_box = false;
        $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
        $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
        return;
      }
      var is_foreverOrNow = $scope.meeting.is_foreverOrNow;
      //将数据设置为默认值
      //	$scope.resetForForever($scope.meeting);
      $scope.meeting.is_foreverOrNow = is_foreverOrNow;
      $scope.meeting.startTime = new Date();
      MixedMeetingService.nowMixedMeeting(
        { isValidate: isValidate },
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 10026) {
            $scope.loading_box = false;
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            var indexModal = layer.confirm(
              $rootScope.data.conferenceConflict,
              {
                btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
              },
              function() {
                $scope.addOrUpdate(0);
                layer.close(indexModal);
              },
              function() {
                console.log('cancel');
              }
            );
          } else if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            $scope.loading_box = false;
            if (data.status == 10027) {
              $('#template_decs').modal('show');
              $scope.meetingRoomLists = data.data;
              console.log(data);
            } else if (data.status == 10034) {
              logger.logWarning($rootScope.data.resetMeeting);
            } else if (data.status == 1000303) {
              logger.logWarning($rootScope.data.mcuConfigError);
            } else {
              logger.logError(data.message);
            }
          }
        }
      );
    } else if ($scope.isMixed == 1) {
      //正常预约混合会议
      var a = JSON.stringify($filter('meetingFilter')($scope.meeting));
      MixedMeetingService.addMixed(
        { isValidate: isValidate },
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 10026) {
            $scope.loading_box = false;
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            var indexModal = layer.confirm(
              $rootScope.data.conferenceConflict,
              {
                btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
              },
              function() {
                $scope.addOrUpdate(0);
                layer.close(indexModal);
              },
              function() {
                console.log('cancel');
              }
            );
          } else if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            $scope.loading_box = false;
            if (data.status == 10027) {
              $('#template_decs').modal('show');
              $scope.meetingRoomLists = data.data;
              console.log(data);
            } else if (data.status == 10034) {
              logger.logWarning($rootScope.data.resetMeeting);
            } else if (data.status == 1000303) {
              logger.logWarning($rootScope.data.mcuConfigError);
            } else if (data.status == 302) {
              logger.logWarning($rootScope.data.failCreateMeeting);
            } else {
              logger.logError(data.message);
            }
          }
        }
      );
    } else {
      //正常预约
      console.log($filter('meetingFilter')($scope.meeting));
      MeetingService.add(
        { isValidate: isValidate },
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 10026) {
            $scope.loading_box = false;
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            var indexModal = layer.confirm(
              $rootScope.data.conferenceConflict,
              {
                btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
              },
              function() {
                $scope.addOrUpdate(0);
                layer.close(indexModal);
              },
              function() {
                console.log('cancel');
              }
            );
          } else if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            $scope.loading_box = false;
            if (data.status == 10027) {
              $('#template_decs').modal('show');
              $scope.meetingRoomLists = data.data;
              console.log(data);
            } else if (data.status == 10034) {
              logger.logWarning($rootScope.data.resetMeeting);
            } else if (data.status == 1000303) {
              logger.logWarning($rootScope.data.mcuConfigError);
            } else {
              logger.logError(data.message);
            }
          }
        }
      );
    }
  }
  if (
    MeetingReserve.mixedUmeetingNum != null &&
    MeetingReserve.mixedUmeetingNum != ''
  ) {
    $scope.isMixed = 1;
  }
  if (!!MeetingReserve.uuid) {
    //修改会议
    if ($scope.meeting.is_forever == 1) {
      //a 改成永久会议
      //将数据设置为默认值
      $scope.resetForForever($scope.meeting);
      MeetingService.foreverMeeting(
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            $scope.loading_box = false;
            logger.logError(data.message);
          }
        }
      );
    } else if ($scope.meeting.is_foreverOrNow == 1 && $scope.isMixed != 1) {
      //b 改成立即会议
      //判断最大方是否开启，并且会议室是否超过最大方限制
      if (
        $scope.approve.max_attend_inuse != '0' &&
        $scope.login_user.roleId != '1' &&
        $scope.meeting.meetingRoomUuids.length > $scope.login_user.max_attend
      ) {
        logger.logWarning($rootScope.data.chooseMeetingRoom);
        $scope.loading_box = false;
        $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
        $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
        return;
      }
      //判断会议时长限制是否开启，并且会议时长超过设定时长
      if (
        $scope.approve.max_time != '-1' &&
        $scope.login_user.roleId != '1' &&
        ($scope.hours > $scope.approve.max_time ||
          ($scope.minutes > 0 && $scope.hours == $scope.approve.max_time))
      ) {
        logger.logWarning($rootScope.data.meetingTimeLength);
        $scope.loading_box = false;
        $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
        $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
        return;
      }
      var is_foreverOrNow = $scope.meeting.is_foreverOrNow;

      //将数据设置为默认值
      $scope.meeting.is_foreverOrNow = is_foreverOrNow;
      $scope.meeting.startTime = new Date();
      MeetingService.nowMeeting(
        { isValidate: isValidate },
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 10026) {
            $scope.loading_box = false;
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            var indexModal = layer.confirm(
              $rootScope.data.conferenceConflict,
              {
                btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
              },
              function() {
                $scope.addOrUpdate(0);
                layer.close(indexModal);
              },
              function() {
                console.log('cancel');
              }
            );
          } else if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            $scope.loading_box = false;
            if (data.status == 10027) {
              $('#template_decs').modal('show');
              $scope.meetingRoomLists = data.data;
              console.log(data);
            } else if (data.status == 10034) {
              logger.logWarning($rootScope.data.resetMeeting);
            } else if (data.status == 1000303) {
              logger.logWarning($rootScope.data.mcuConfigError);
            } else {
              logger.logError(data.message);
            }
          }
        }
      );
    } else if ($scope.isMixed == 1) {
      //修改预约的混合会议
      //c 正常修改混合会议
      MixedMeetingService.updateMixed(
        { isValidate: isValidate },
        JSON.stringify($filter('meetingFilter')($scope.meeting)),
        function(data) {
          if (data.status == 10026) {
            $scope.loading_box = false;
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            var indexModal = layer.confirm(
              $rootScope.data.conferenceConflict,
              {
                btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
              },
              function() {
                $scope.addOrUpdate(0);
                layer.close(indexModal);
              },
              function() {
                console.log('cancel');
              }
            );
          } else if (data.status == 200) {
            MeetingReserveFactory.reset(MeetingReserve);
            $state.go('layout.conference_mine');
          } else {
            console.log(data);
            $scope.loading_box = false;
            $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
            $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
            $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
            if (data.status == 10027) {
              $('#template_decs').modal('show');
              $scope.meetingRoomLists = data.data;
              console.log(data);
            } else if (data.status == 10034) {
              logger.logWarning($rootScope.data.resetMeeting);
            } else {
              logger.logError(data.message);
            }
          }
        }
      );
    } else {
      //c 修改并审批
      if (
        $scope.login_user.id != $scope.meeting.userId &&
        $scope.meeting.node != 0 &&
        $scope.login_user.account != 'admin'
      ) {
        $scope.loading_box = false;
        // console.log(66666);
        ApproveService.update(
          { isValidate: isValidate },
          JSON.stringify($filter('meetingFilter')($scope.meeting)),
          function(data) {
            if (data.status == 10026) {
              $scope.loading_box = false;
              $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
              $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
              $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
              var indexModal = layer.confirm(
                $rootScope.data.conferenceConflict,
                {
                  btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                  title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
                },
                function() {
                  $scope.addOrUpdate(0);
                  layer.close(indexModal);
                },
                function() {
                  console.log('cancel');
                }
              );
            } else if (data.status == 200) {
              MeetingReserveFactory.reset(MeetingReserve);
              $state.go('layout.conference_mine');
            } else {
              console.log(data);
              $scope.loading_box = false;
              $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
              $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
              $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
              if (data.status == 10027) {
                $('#template_decs').modal('show');
                $scope.meetingRoomLists = data.data;
                console.log(data);
              } else {
                logger.logError(data.message);
              }
            }
          }
        );
      } else {
        //c 正常修改
        MeetingService.update(
          { isValidate: isValidate },
          JSON.stringify($filter('meetingFilter')($scope.meeting)),
          function(data) {
            if (data.status == 10026) {
              $scope.loading_box = false;
              $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
              $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
              $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
              var indexModal = layer.confirm(
                $rootScope.data.conferenceConflict,
                {
                  btn: [$rootScope.data.confirm, $rootScope.data.cancel],
                  title: [$rootScope.data.hint, 'font-size:18px;'] //按钮
                },
                function() {
                  $scope.addOrUpdate(0);
                  layer.close(indexModal);
                },
                function() {
                  console.log('cancel');
                }
              );
            } else if (data.status == 200) {
              MeetingReserveFactory.reset(MeetingReserve);
              $state.go('layout.conference_mine');
            } else {
              console.log(data);
              $scope.loading_box = false;
              $scope.meeting.bandwidthObject = $scope.temple.bandwidthObject;
              $scope.meeting.categoriesObject = $scope.temple.categoriesObject;
              $scope.meeting.meetingtagObject = $scope.temple.meetingtagObject;
              if (data.status == 10027) {
                $('#template_decs').modal('show');
                $scope.meetingRoomLists = data.data;
                console.log(data);
              } else if (data.status == 10034) {
                logger.logWarning($rootScope.data.resetMeeting);
              } else {
                logger.logError(data.message);
              }
            }
          }
        );
      }
    }
  }
};
```