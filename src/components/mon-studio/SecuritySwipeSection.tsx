import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Check,
  Edit3,
  Lock,
  LogOut,
  MessageSquare,
  User,
  KeyRound,
  X
} from 'lucide-react';
import { UserAccount } from '../../types';
import { STAGE_PERSPECTIVE } from '../../config/cardLayout';

export type MessagePermissionOption = 'all' | 'invitation' | 'none';

interface SecuritySwipeSectionProps {
  profile: UserAccount;
  onUpdateProfile: (data: Partial<UserAccount>) => void;
  onChangePassword: (newPassword: string) => { success: boolean; message?: string };
  onLogout: () => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

const CARD_META = [
  { id: 'identity', title: 'Identité', icon: User },
  { id: 'account', title: 'Compte', icon: KeyRound },
  { id: 'messaging', title: 'Messagerie', icon: MessageSquare }
] as const;

const MESSAGING_OPTIONS: Array<{
  id: MessagePermissionOption;
  title: string;
  subtitle: string;
}> = [
  {
    id: 'all',
    title: 'Tous les membres',
    subtitle: 'Contacts directs ouverts'
  },
  {
    id: 'invitation',
    title: 'Sur invitation',
    subtitle: 'Motif validé requis'
  },
  {
    id: 'none',
    title: 'Désactivée',
    subtitle: 'Aucun message direct'
  }
];

function compressImageFileToDataUrl(file: File, maxDimension = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture image impossible'));
    reader.onload = () => {
      const rawResult = typeof reader.result === 'string' ? reader.result : '';
      if (!rawResult) {
        reject(new Error('Image vide'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(rawResult);
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width || 1, img.height || 1));
        const targetW = Math.max(1, Math.round((img.width || maxDimension) * scale));
        const targetH = Math.max(1, Math.round((img.height || maxDimension) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawResult);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          resolve(rawResult);
        }
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  });
}

export const SecuritySwipeSection: React.FC<SecuritySwipeSectionProps> = ({
  profile,
  onUpdateProfile,
  onChangePassword,
  onLogout,
  onBack,
  onShowToast
}) => {
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isEditingCard, setIsEditingCard] = useState<boolean>(false);

  // Carte 1 : Identité
  const [name, setName] = useState<string>(profile.name || 'Romeo Nonvide');
  const [handle, setHandle] = useState<string>(profile.handle || '@romeo');
  const [city, setCity] = useState<string>(profile.city || profile.territory || 'Cotonou');
  const [country, setCountry] = useState<string>(profile.country || 'Bénin');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    profile.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg'
  );
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Carte 2 : Compte
  const [email, setEmail] = useState<string>(profile.email || 'qoctales@gmail.com');
  const [phone, setPhone] = useState<string>(profile.phone || '');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Carte 3 : Messagerie
  const [messagePermission, setMessagePermission] = useState<MessagePermissionOption>(() => {
    const saved = localStorage.getItem('yonywood_msg_permission');
    if (saved === 'all' || saved === 'invitation' || saved === 'none') return saved;
    return 'all';
  });

  // Resynchroniser si le profil externe change hors édition
  useEffect(() => {
    if (!isEditingCard) {
      setName(profile.name || 'Romeo Nonvide');
      setHandle(profile.handle || '@romeo');
      setCity(profile.city || profile.territory || 'Cotonou');
      setCountry(profile.country || 'Bénin');
      setAvatarUrl(profile.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg');
      setEmail(profile.email || 'qoctales@gmail.com');
      setPhone(profile.phone || '');
    }
  }, [profile, isEditingCard]);

  // Gestion du swipe — strictement désactivé pendant le mode édition
  const [dragOffset, setDragOffset] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number | null>(null);
  const didDragRef = useRef<boolean>(false);

  const resetFormFromProfile = () => {
    setName(profile.name || 'Romeo Nonvide');
    setHandle(profile.handle || '@romeo');
    setCity(profile.city || profile.territory || 'Cotonou');
    setCountry(profile.country || 'Bénin');
    setAvatarUrl(profile.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg');
    setEmail(profile.email || 'qoctales@gmail.com');
    setPhone(profile.phone || '');
    setIsChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    const savedMsg = localStorage.getItem('yonywood_msg_permission');
    if (savedMsg === 'all' || savedMsg === 'invitation' || savedMsg === 'none') {
      setMessagePermission(savedMsg);
    }
  };

  const goToCard = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= CARD_META.length) return;
    if (isEditingCard) {
      resetFormFromProfile();
      setIsEditingCard(false);
    }
    isDraggingRef.current = false;
    startXRef.current = null;
    setDragOffset(0);
    setCardIndex(targetIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditingCard) return;
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    didDragRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEditingCard || !isDraggingRef.current || startXRef.current === null) return;
    const diff = e.touches[0].clientX - startXRef.current;
    if (Math.abs(diff) > 6) {
      didDragRef.current = true;
    }
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (isEditingCard || !isDraggingRef.current) {
      isDraggingRef.current = false;
      startXRef.current = null;
      setDragOffset(0);
      return;
    }
    isDraggingRef.current = false;
    const threshold = 52;
    if (dragOffset < -threshold && cardIndex < CARD_META.length - 1) {
      setCardIndex((prev) => prev + 1);
    } else if (dragOffset > threshold && cardIndex > 0) {
      setCardIndex((prev) => prev - 1);
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditingCard) return;
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
    didDragRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEditingCard || !isDraggingRef.current || startXRef.current === null) return;
    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) > 6) {
      didDragRef.current = true;
    }
    setDragOffset(diff);
  };

  const handleMouseUpOrLeave = () => {
    if (isEditingCard || !isDraggingRef.current) {
      isDraggingRef.current = false;
      startXRef.current = null;
      setDragOffset(0);
      return;
    }
    isDraggingRef.current = false;
    const threshold = 52;
    if (dragOffset < -threshold && cardIndex < CARD_META.length - 1) {
      setCardIndex((prev) => prev + 1);
    } else if (dragOffset > threshold && cardIndex > 0) {
      setCardIndex((prev) => prev - 1);
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      setAvatarUrl(dataUrl);
    } catch {
      onShowToast("Impossible de lire l'image sélectionnée.");
    }
  };

  const handleValidateActiveCard = () => {
    if (cardIndex === 0) {
      const cleanName = name.trim() || profile.name || 'Romeo Nonvide';
      const cleanHandle = handle.trim() || '@romeo';
      const cleanCity = city.trim();
      const cleanCountry = country.trim();
      onUpdateProfile({
        name: cleanName,
        handle: cleanHandle,
        city: cleanCity,
        territory: cleanCity,
        country: cleanCountry,
        avatarUrl: avatarUrl.trim() || '/assets/images/romeo_avatar_1792698425983.jpg'
      });
      setIsEditingCard(false);
      onShowToast('Identité enregistrée.');
      return;
    }

    if (cardIndex === 1) {
      if (isChangingPassword) {
        if (newPassword.trim().length < 6) {
          setPasswordError('6 caractères minimum.');
          return;
        }
        if (newPassword !== confirmPassword) {
          setPasswordError('Les mots de passe ne correspondent pas.');
          return;
        }
        const res = onChangePassword(newPassword);
        if (!res.success) {
          setPasswordError(res.message || 'Mot de passe invalide.');
          return;
        }
      }

      onUpdateProfile({
        email: email.trim() || profile.email || 'qoctales@gmail.com',
        phone: phone.trim()
      });
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
      setIsEditingCard(false);
      onShowToast('Compte mis à jour.');
      return;
    }

    if (cardIndex === 2) {
      try {
        localStorage.setItem('yonywood_msg_permission', messagePermission);
      } catch {
        // ignore
      }
      setIsEditingCard(false);
      onShowToast('Messagerie enregistrée.');
    }
  };

  const handleCancelEdit = () => {
    resetFormFromProfile();
    setIsEditingCard(false);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans overflow-hidden">
      {/* Barre supérieure */}
      <header className="shrink-0 h-14 sm:h-16 px-4 sm:px-6 border-b border-stone-200/80 bg-white/95 flex items-center justify-between z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="Retour à Mon Studio"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-editorial text-base sm:text-lg font-bold text-stone-900 truncate">
            Sécurité
          </h1>
        </div>

        {/* Navigation rapide entre cartes via petites flèches */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => goToCard(cardIndex - 1)}
            disabled={cardIndex === 0}
            className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 cursor-pointer transition-colors"
            aria-label="Carte précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => goToCard(cardIndex + 1)}
            disabled={cardIndex === CARD_META.length - 1}
            className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 cursor-pointer transition-colors"
            aria-label="Carte suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Scène des 3 cartes swipables */}
      <main
        className={`flex-1 min-h-0 flex flex-col items-center justify-center px-3 sm:px-6 py-3 sm:py-5 overflow-hidden ${
          isEditingCard ? 'select-text' : 'select-none touch-pan-y'
        }`}
        onTouchStart={isEditingCard ? undefined : handleTouchStart}
        onTouchMove={isEditingCard ? undefined : handleTouchMove}
        onTouchEnd={isEditingCard ? undefined : handleTouchEnd}
        onMouseDown={isEditingCard ? undefined : handleMouseDown}
        onMouseMove={isEditingCard ? undefined : handleMouseMove}
        onMouseUp={isEditingCard ? undefined : handleMouseUpOrLeave}
        onMouseLeave={isEditingCard ? undefined : handleMouseUpOrLeave}
      >
        <div
          className="relative w-full max-w-[380px] flex-1 min-h-0 max-h-[560px] flex items-center justify-center"
          style={{ perspective: STAGE_PERSPECTIVE }}
        >
          {CARD_META.map((meta, idx) => {
            const diff = idx - cardIndex;
            const isCenter = diff === 0;
            const Icon = meta.icon;

            const activeDrag = isEditingCard ? 0 : dragOffset;
            let transformStyle = '';
            let zIndex = 10;
            let opacity = 0;

            if (diff === 0) {
              transformStyle = `translateX(${activeDrag}px) translateZ(20px) rotateY(${activeDrag * -0.06}deg) scale(1)`;
              zIndex = 30;
              opacity = 1;
            } else if (diff === 1) {
              transformStyle = `translateX(calc(92% + ${activeDrag}px)) translateZ(-60px) rotateY(-12deg) scale(0.9)`;
              zIndex = 20;
              opacity = 0.45;
            } else if (diff === -1) {
              transformStyle = `translateX(calc(-92% + ${activeDrag}px)) translateZ(-60px) rotateY(12deg) scale(0.9)`;
              zIndex = 20;
              opacity = 0.45;
            } else {
              transformStyle = `translateX(${diff > 0 ? '180%' : '-180%'}) scale(0.8)`;
              zIndex = 5;
              opacity = 0;
            }

            const isThisCardEditing = isCenter && isEditingCard;

            return (
              <section
                key={meta.id}
                onClick={() => {
                  if (didDragRef.current) {
                    didDragRef.current = false;
                    return;
                  }
                  if (!isCenter) {
                    goToCard(idx);
                  }
                }}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  pointerEvents: Math.abs(diff) <= 1 ? 'auto' : 'none',
                  transition:
                    isDraggingRef.current && !isEditingCard
                      ? 'none'
                      : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                }}
                className={`absolute inset-0 bg-white rounded-3xl border shadow-sm flex flex-col overflow-hidden ${
                  isThisCardEditing
                    ? 'border-[#A2482B] ring-1 ring-[#A2482B]/40'
                    : isCenter
                      ? 'border-stone-200/95'
                      : 'border-stone-200/70 cursor-pointer'
                }`}
                aria-hidden={!isCenter}
              >
                {/* En-tête carte + Bouton explicite Modifier / Valider */}
                <div className="shrink-0 px-5 py-3.5 border-b border-stone-100 flex items-center justify-between gap-2 bg-white">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                      {meta.title}
                    </h2>
                  </div>

                  {isCenter && (
                    <div
                      className="flex items-center gap-1.5 shrink-0"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {isThisCardEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="w-8 h-8 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 flex items-center justify-center cursor-pointer transition-colors"
                            aria-label="Annuler les modifications"
                            title="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleValidateActiveCard}
                            className="px-3.5 py-1.5 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Valider</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingCard(true)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Contenu scrollable interne de la carte */}
                <div
                  className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3.5"
                  onMouseDown={(e) => {
                    if (isThisCardEditing) e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    if (isThisCardEditing) e.stopPropagation();
                  }}
                >
                  {/* ============================================= */}
                  {/* CARTE 1 : IDENTITÉ                            */}
                  {/* ============================================= */}
                  {meta.id === 'identity' && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3.5 pb-3 border-b border-stone-100">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <img
                            src={avatarUrl}
                            alt={name}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = '/assets/images/romeo_avatar_1792698425983.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            disabled={!isThisCardEditing}
                            onClick={() => photoInputRef.current?.click()}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                              isThisCardEditing
                                ? 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800 cursor-pointer'
                                : 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Changer la photo</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                          Nom et prénom
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          readOnly={!isThisCardEditing}
                          disabled={!isThisCardEditing}
                          className={`w-full px-3 py-2 rounded-xl border text-sm transition-colors ${
                            isThisCardEditing
                              ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                              : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                          Identifiant public
                        </label>
                        <input
                          type="text"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          readOnly={!isThisCardEditing}
                          disabled={!isThisCardEditing}
                          className={`w-full px-3 py-2 rounded-xl border text-sm font-mono transition-colors ${
                            isThisCardEditing
                              ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                              : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                            Ville
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-3 py-2 rounded-xl border text-sm transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                            Pays
                          </label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-3 py-2 rounded-xl border text-sm transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============================================= */}
                  {/* CARTE 2 : COMPTE                              */}
                  {/* ============================================= */}
                  {meta.id === 'account' && (
                    <div className="min-h-full flex flex-col justify-between gap-4">
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                            Email du compte
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-3 py-2 rounded-xl border text-sm font-mono transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                            Numéro de téléphone
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            placeholder="+229 01 00 00 00 00"
                            onChange={(e) => setPhone(e.target.value)}
                            readOnly={!isThisCardEditing}
                            disabled={!isThisCardEditing}
                            className={`w-full px-3 py-2 rounded-xl border text-sm transition-colors ${
                              isThisCardEditing
                                ? 'bg-white border-stone-300 text-stone-900 focus:outline-none focus:border-[#A2482B]'
                                : 'bg-stone-50/70 border-stone-200/80 text-stone-800'
                            }`}
                          />
                        </div>

                        <div className="pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-semibold text-stone-500">
                              Mot de passe
                            </label>
                            {isThisCardEditing && !isChangingPassword && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsChangingPassword(true);
                                  setPasswordError(null);
                                }}
                                className="text-[11px] font-semibold text-[#A2482B] hover:underline cursor-pointer"
                              >
                                Changer le mot de passe
                              </button>
                            )}
                          </div>

                          {!isChangingPassword ? (
                            <div className="w-full px-3 py-2 rounded-xl border border-stone-200/80 bg-stone-50/70 text-sm text-stone-600 flex items-center justify-between">
                              <span className="tracking-widest">••••••••••</span>
                              <Lock className="w-3.5 h-3.5 text-stone-400" />
                            </div>
                          ) : (
                            <div className="space-y-2 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                              <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                  setPasswordError(null);
                                }}
                                placeholder="Nouveau mot de passe"
                                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#A2482B]"
                              />
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  setPasswordError(null);
                                }}
                                placeholder="Confirmer le mot de passe"
                                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#A2482B]"
                              />
                              {passwordError && (
                                <p className="text-[11px] text-rose-600 font-medium">{passwordError}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Lien discret Se déconnecter tout en bas de la carte 2 */}
                      <div className="pt-3 border-t border-stone-100 flex justify-center">
                        <button
                          type="button"
                          onClick={onLogout}
                          className="text-xs font-medium text-stone-400 hover:text-rose-600 inline-flex items-center gap-1.5 py-1.5 px-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ============================================= */}
                  {/* CARTE 3 : MESSAGERIE (VERSION COMPACTE)       */}
                  {/* ============================================= */}
                  {meta.id === 'messaging' && (
                    <div className="space-y-2.5">
                      {MESSAGING_OPTIONS.map((option) => {
                        const isSelected = messagePermission === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            disabled={!isThisCardEditing}
                            onClick={() => {
                              if (!isThisCardEditing) return;
                              setMessagePermission(option.id);
                            }}
                            className={`w-full text-left p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                              isSelected
                                ? 'border-[#A2482B] bg-[#A2482B]/5 ring-1 ring-[#A2482B]'
                                : 'border-stone-200 bg-stone-50/60'
                            } ${isThisCardEditing ? 'cursor-pointer hover:border-stone-300' : 'cursor-default'}`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                                {option.title}
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                                {option.subtitle}
                              </p>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'border-[#A2482B] bg-[#A2482B] text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Indicateurs à points + petites flèches cliquables (actifs même en mode édition) */}
        <div className="shrink-0 mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goToCard(cardIndex - 1)}
            disabled={cardIndex === 0}
            className="w-7 h-7 rounded-full border border-stone-200 bg-white text-stone-700 disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed hover:bg-stone-50"
            aria-label="Carte précédente"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            {CARD_META.map((meta, idx) => {
              const active = idx === cardIndex;
              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => goToCard(idx)}
                  aria-label={`Aller à la carte ${meta.title}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    active ? 'w-6 bg-[#A2482B]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goToCard(cardIndex + 1)}
            disabled={cardIndex === CARD_META.length - 1}
            className="w-7 h-7 rounded-full border border-stone-200 bg-white text-stone-700 disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed hover:bg-stone-50"
            aria-label="Carte suivante"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
};
