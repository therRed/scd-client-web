<template>
  <div class="profile-list">
    <page-layout :title="title">
      <!-- 已选条件 -->
      <div slot="extra" v-if="check.length > 0">
        <a-tag
          v-for="(val, i) in check"
          :key="i"
          visible
          closable
          @close="removeFilter(val)"
        >
          {{ val }}
        </a-tag>
        <a-button type="link" @click="selectAll">查看全部稿件</a-button>
      </div>
      <div class="body">
        <!-- 筛选 -->
        <a-card>
          <div class="filter">
            <a-row
              class="grid"
              type="flex"
              v-for="(val, i) in filterList"
              :key="i"
            >
              <a-col
                class="data"
                :class="!val.collapse ? 'collapse' : ''"
                :span="23"
              >
                <a-row
                  class="item"
                  type="flex"
                  align="middle"
                  v-for="(sVal, sI) in val.children"
                  :key="sI"
                >
                  <a-col :span="2" class="title">{{ sVal.name }}</a-col>
                  <a-col :span="22">
                    <a-row type="flex">
                      <a-col
                        :span="3"
                        v-for="(lVal, lI) in sVal.children"
                        :key="lI"
                      >
                        <a-button type="link" block @click="checkFilter(lVal)">
                          {{ lVal }}
                        </a-button>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>

              <a-col class="tag" :span="1" v-if="val.tag">
                <a-button
                  type="link"
                  block
                  v-if="val.collapse"
                  @click="collapse(i)"
                >
                  <a-icon type="double-left" />
                  <div class="text">收起</div>
                </a-button>
                <a-tooltip title="展开">
                  <a-button
                    type="primary"
                    block
                    v-if="!val.collapse"
                    @click="collapse(i)"
                  >
                    <a-icon type="double-right" />
                  </a-button>
                </a-tooltip>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </div>
    </page-layout>
  </div>
</template>

<script>
  /**
  * @Class: profile
  * @Module: list
  * @Auther: ['admin']
  * @Description:
  * @Version: 1.0.0
  ---- Created by "Sitdown.liu<sitdown.liu@gmail.com>" on "2020/09/16 15:19:20" ---*/
  import PageLayout from "@/layouts/PageLayout";
  import { getFilter } from "@/services/mock/profile";
  export default {
    components: { PageLayout },
    data() {
      return {
        filterList: [],
        title: "所有稿件",
        check: [],
      };
    },
    mounted() {
      this.getFilter();
    },
    watch: {
      check(val) {
        val.length > 0
          ? this.$set(this, "title", " ")
          : this.$set(this, "title", "所有稿件");
      },
    },
    methods: {
      //获取筛选条件列表
      getFilter() {
        getFilter().then(async (res) => {
          console.log(res);
          const filterList = await (async (filterList = []) => {
            await res.data.forEach((val, i) => {
              let collapse = i === 0 ? true : false,
                tag = val.length > 1 ? true : false;
              filterList.push({ collapse, tag, children: val });
            });
            return filterList;
          })();

          this.$set(this, "filterList", filterList);
        });
      },
      //展开&收起
      collapse(index) {
        this.$set(
          this.filterList[index],
          "collapse",
          !this.filterList[index].collapse
        );
      },
      //增加筛选条件
      async checkFilter(item) {
        let check = this.check;
        !check ? (check = ["undefind", item]) : check.push(item);
        await this.$set(this, "check", [...new Set(check)]);
      },
      //删除筛选添加
      async removeFilter(tags) {
        const check = this.check.filter((tag) => tag !== tags);
        this.check = check;
      },
      //查看全部稿件
      selectAll() {
        this.$set(this, "check", []);
      },
    },
  };
</script>

<style lang="less" scoped>
  .profile-list {
    .filter {
      width: 100%;

      .grid {
        margin-bottom: 20px;

        &:last-child {
          margin: 0;
        }

        .data {
          max-height: 900px;
          border: 1px solid #dddddd;
          padding: 0 15px;
          line-height: 42px;
          transition: max-height 0.6s;
          overflow: hidden;
          -moz-transition: max-height 0.6s; /* Firefox 4 */
          -webkit-transition: max-height 0.6s; /* Safari and Chrome */
          -o-transition: max-height 0.6s; /* Opera */

          &.collapse {
            max-height: 42px;
          }

          .item {
            border-bottom: 1px solid #eeeeee;

            &:last-child {
              border: 0;
            }

            .title {
              border-right: 1px solid #eeeeee;
              line-height: 24px;
              text-align: center;
              color: #999999;
            }
          }
        }

        .tag {
          .ant-btn {
            width: 32px;
            height: auto;
            padding: 5px 0;
            border: 1px solid #dddddd;
            border-left: 0;
            border-radius: 0;

            .anticon {
              transform: rotate(90deg);
            }

            .anticon-double-right {
              line-height: 30px;
            }

            .text {
              width: 16px;
              margin: 0 auto;
              white-space: normal;
            }
          }
        }
      }
    }
  }
</style>
