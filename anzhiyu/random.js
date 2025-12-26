var posts=["edgeone-adb468b0a8c0/","git-8a2ab4cae0a3/","favicon-324dcbe00342/","herf-e7f8ddf1cad4/","pymusic-55808baffa35/","linux-7ec40fedb040/","regex-85fc7a023f9c/","sqlserver-2e1afddb047d/","vercel-ec68f96264c1/","vs-739ea09d4020/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };var friend_link_list=[{"name":"音悦台","link":"https://music.686909.xyz/","avatar":"https://music.686909.xyz/favicon.ico","descr":"快速、简单且强大的音乐网站"},{"name":"冈易云音乐","link":"https://mk.686909.xyz/","avatar":"https://mk.686909.xyz/favicon.ico","descr":"免费音乐网站"},{"name":"RF极客日志","link":"https://itrf.cn/","avatar":"/images/avatar.jpg","descr":"分享技术与生活点滴","siteshot":"https://t.alcy.cc/moez","color":"vip","tag":"技术"}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      const randomIndex = Math.floor(Math.random() * friend_link_list.length);
      const { name, link } = friend_link_list.splice(randomIndex, 1)[0];
      Snackbar.show({
        text:
          "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
        duration: 8000,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (element) {
          element.style.opacity = 0;
          window.open(link, "_blank");
        },
      });
    }
    function addFriendLinksInFooter() {
      var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
      if(!footerRandomFriendsBtn) return;
      footerRandomFriendsBtn.style.opacity = "0.2";
      footerRandomFriendsBtn.style.transitionDuration = "0.3s";
      footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
      const finalLinkList = [];
  
      let count = 0;

      while (friend_link_list.length && count < 3) {
        const randomIndex = Math.floor(Math.random() * friend_link_list.length);
        const { name, link, avatar } = friend_link_list.splice(randomIndex, 1)[0];
  
        finalLinkList.push({
          name,
          link,
          avatar,
        });
        count++;
      }
  
      let html = finalLinkList
        .map(({ name, link }) => {
          const returnInfo = "<a class='footer-item' href='" + link + "' target='_blank' rel='noopener nofollow'>" + name + "</a>"
          return returnInfo;
        })
        .join("");
  
      html += "<a class='footer-item' href='/link/'>更多</a>";

      document.getElementById("friend-links-in-footer").innerHTML = html;

      setTimeout(()=>{
        footerRandomFriendsBtn.style.opacity = "1";
      }, 300)
    };