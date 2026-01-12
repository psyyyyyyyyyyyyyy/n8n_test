import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 페이지 방문 기록
export async function trackPageView() {
  try {
    const { error } = await supabase
      .from('page_views')
      .insert({
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('페이지 방문 기록 실패:', error)
    }
  } catch (err) {
    console.error('페이지 방문 기록 오류:', err)
  }
}

// 버튼 클릭 기록
export async function trackButtonClick(buttonName) {
  try {
    const { error } = await supabase
      .from('button_clicks')
      .insert({
        button_name: buttonName,
        page_url: window.location.href,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('버튼 클릭 기록 실패:', error)
    }
  } catch (err) {
    console.error('버튼 클릭 기록 오류:', err)
  }
}

// 통계 조회 (관리용)
export async function getStats() {
  try {
    // 총 페이지 방문수
    const { count: pageViews, error: pageError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    // 총 버튼 클릭수
    const { count: totalClicks, error: clickError } = await supabase
      .from('button_clicks')
      .select('*', { count: 'exact', head: true })

    // 참여하기 버튼 클릭수
    const { count: participateClicks, error: participateError } = await supabase
      .from('button_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('button_name', 'participate')

    if (pageError || clickError || participateError) {
      console.error('통계 조회 실패')
      return null
    }

    // 클릭률 계산 (방문수 대비 참여 버튼 클릭률)
    const clickRate = pageViews > 0 
      ? ((participateClicks / pageViews) * 100).toFixed(2) 
      : 0

    return {
      pageViews,
      totalClicks,
      participateClicks,
      clickRate: `${clickRate}%`
    }
  } catch (err) {
    console.error('통계 조회 오류:', err)
    return null
  }
}
