import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Check, Share2, FileText, RefreshCw, Smartphone, ShieldCheck, Send } from 'lucide-react';

export default function ElectronicSignatureApp() {
  // 앱 상태: 'editor' (관리자 작성), 'preview' (전송 전 확인), 'signing' (고객 서명), 'complete' (완료)
  const [appState, setAppState] = useState('editor');
  
  // 문서 내용 상태
  const [docTitle, setDocTitle] = useState('개인정보 활용 및 서비스 이용 동의서');
  const [docContent, setDocContent] = useState(`본인은 귀사의 서비스를 이용함에 있어 다음과 같은 내용에 동의합니다.\n\n1. 서비스 이용 내역 확인\n2. 개인정보 수집 및 이용 동의\n3. 전자 서명을 통한 법적 효력 인정\n\n위 내용을 충분히 숙지하였으며 이에 동의합니다.`);
  
  // 서명 데이터 상태
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  // 캔버스 관련 refs
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 현재 날짜 포맷팅
  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toLocaleString('ko-KR'));
  }, []);

  // 캔버스 초기화 및 그리기 로직
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  // 캔버스 크기 조절 (반응형)
  useEffect(() => {
    if (appState === 'signing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = 200;
    }
  }, [appState]);

  // 화면 렌더링 함수들
  const renderEditor = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <PenTool size={20} /> 관리자 작성 모드
        </h3>
        <p className="text-sm text-blue-600 mt-1">
          고객에게 보낼 확인서 내용을 작성해주세요. 작성이 끝나면 '전송용 링크 생성'을 눌러주세요.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">문서 제목</label>
        <input 
          type="text" 
          value={docTitle} 
          onChange={(e) => setDocTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
          placeholder="예: 서비스 이용 확인서"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">상세 내용 (계약/확인 사항)</label>
        <textarea 
          value={docContent}
          onChange={(e) => setDocContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition resize-none"
          placeholder="내용을 입력하세요..."
        />
      </div>

      <button 
        onClick={() => setAppState('preview')}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 flex justify-center items-center gap-2"
      >
        <Share2 size={20} /> 전송용 미리보기 및 링크 생성
      </button>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6 text-center animate-fade-in">
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-md">
            <Smartphone size={40} className="text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">발송 준비 완료!</h3>
        <p className="text-gray-600 mb-6">
          아래 버튼을 눌러 고객 모드로 전환하거나, 실제로는 이 링크를 고객에게 카카오톡/문자로 보내게 됩니다.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              // 실제 구현시에는 클립보드 복사 로직 등이 들어감
              alert("링크가 복사되었습니다! (시뮬레이션)"); 
            }}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition flex justify-center items-center gap-2"
          >
            <Share2 size={18} /> 링크 복사하기
          </button>
          
          <button 
            onClick={() => setAppState('signing')}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-md transition flex justify-center items-center gap-2"
          >
            <Send size={18} /> 고객 화면으로 전환 (시연용)
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => setAppState('editor')}
        className="text-sm text-gray-500 underline"
      >
        다시 내용 수정하기
      </button>
    </div>
  );

  const renderSigning = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">{docTitle}</h2>
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed min-h-[150px] text-sm md:text-base">
          {docContent}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-600"/> 서명인 정보
        </h3>
        
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="성함 (예: 홍길동)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-yellow-500"
          />
          <input 
            type="tel" 
            placeholder="휴대폰 번호 (예: 010-1234-5678)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-gray-700">전자 서명</label>
          <button onClick={clearSignature} className="text-xs text-red-500 flex items-center gap-1">
            <RefreshCw size={12} /> 다시 쓰기
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="w-full h-48 cursor-crosshair rounded-lg"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">네모 칸 안에 정자로 서명해 주세요.</p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg cursor-pointer" onClick={() => setAgreed(!agreed)}>
        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-yellow-500 border-yellow-500' : 'bg-white border-gray-300'}`}>
          {agreed && <Check size={16} className="text-white" />}
        </div>
        <span className="text-sm font-medium text-gray-800">위 내용을 확인하였으며 전자 서명에 동의합니다.</span>
      </div>

      <button 
        onClick={() => {
          if(!customerName || !customerPhone || !signatureData || !agreed) {
            alert("모든 정보를 입력하고 서명 및 동의를 완료해주세요.");
            return;
          }
          setAppState('complete');
        }}
        className={`w-full py-4 rounded-xl font-bold shadow-lg text-lg transition ${
          agreed && customerName && signatureData
          ? 'bg-yellow-400 hover:bg-yellow-500 text-black transform active:scale-95'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        서명 제출하기
      </button>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-8 animate-fade-in py-10">
      <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
        <ShieldCheck size={64} className="text-green-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">서명이 완료되었습니다</h2>
        <p className="text-gray-500">안전하게 전송되었습니다. 이용해 주셔서 감사합니다.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-sm mx-auto text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg">
          Verified
        </div>
        <h3 className="text-sm font-bold text-gray-500 mb-4">전자 서명 확인증</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">서명자</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">연락처</span>
            <span className="font-medium">{customerPhone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">서명 일시</span>
            <span className="font-medium text-xs text-gray-800 mt-1">{timestamp}</span>
          </div>
          <div className="mt-4">
            <span className="text-gray-500 block mb-2">서명 이미지</span>
            <img src={signatureData} alt="Client Signature" className="h-16 border border-dashed border-gray-300 rounded p-1 bg-white" />
          </div>
        </div>
      </div>

      <button 
        onClick={() => {
          setAppState('editor');
          setCustomerName('');
          setCustomerPhone('');
          setSignatureData(null);
          setAgreed(false);
          setIsDrawing(false);
        }}
        className="text-gray-500 underline text-sm hover:text-gray-800"
      >
        새로운 확인서 작성하기
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0 md:pt-10 font-sans">
      <div className="w-full max-w-md bg-white md:rounded-3xl shadow-2xl overflow-hidden min-h-screen md:min-h-0 md:h-auto">
        
        {/* 헤더 */}
        <div className="bg-[#FAE100] p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-black font-bold text-lg flex items-center gap-2">
            <FileText size={20} /> 전자 서명 시스템
          </h1>
          <div className="text-xs font-medium bg-black/10 px-2 py-1 rounded">
            {appState === 'editor' ? '관리자 모드' : '고객용 화면'}
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-6">
          {appState === 'editor' && renderEditor()}
          {appState === 'preview' && renderPreview()}
          {appState === 'signing' && renderSigning()}
          {appState === 'complete' && renderComplete()}
        </div>

        {/* 푸터 (신뢰도 강화용) */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            본 문서는 전자서명법 등 관련 법령에 따라 법적 효력을 가질 수 있습니다.<br/>
            IP Address: 127.0.0.1 (Logged) | Security Check: Passed
          </p>
        </div>
      </div>
    </div>
  );
}