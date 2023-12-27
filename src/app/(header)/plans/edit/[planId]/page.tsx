'use client';

import {
  AjajaButton,
  Button,
  IconSwitchButton,
  InputTag,
  Modal,
  ModalSelectIcon,
  PlanInput,
  Tag,
} from '@/components';
import { planIcons } from '@/constants/planIcons';
import { useEditPlanMutation } from '@/hooks/apis/useEditPlanMutation';
import { useGetPlanQuery } from '@/hooks/apis/useGetPlanQuery';
import { useWritablePlan } from '@/hooks/useWritablePlan';
import { checkIsMyPlan } from '@/utils/checkIsMyPlan';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './index.scss';

export default function EditPage({ params }: { params: { planId: string } }) {
  const { planId } = params;
  const router = useRouter();
  const { plan: planData } = useGetPlanQuery(Number(planId));
  const { mutate: editPlan } = useEditPlanMutation(Number(planId));
  const isMyPlan = checkIsMyPlan(planData.userId);
  //TODO: 권한설정 여기서?
  useEffect(() => {
    if (!isMyPlan) {
      router.push('./home');
    }
  }, [isMyPlan, router]);
  const {
    nextTextAreaRef,
    planContent,
    handleAddTag,
    handleChangeCanAjaja,
    handleChangeDescription,
    handleChangeIsPublic,
    handleChangeTitle,
    handleRemoveTag,
    handleChangeIconNumber,
  } = useWritablePlan(planData);
  const [isSelectIconModalOpen, setIsSelectIconModalOpen] = useState(false);

  const handleEditPlan = () => {
    // TODO:
    editPlan({ planId: Number(planId), planData: planContent });
  };

  return (
    <div className={classNames('edit-plan-content')}>
      <div className="edit-plan-content__main">
        <div className="edit-plan-content__icon">
          <button
            onClick={() => {
              setIsSelectIconModalOpen(true);
            }}>
            <Image
              src={`/animal/${planIcons[planContent.iconNumber]}.png`}
              alt={`${planIcons[planContent.iconNumber]}`}
              width={50}
              height={50}
              priority
            />
          </button>
          <span className="font-size-xs">아이콘을 클랙해 변경할 수 있어요</span>
        </div>
        <div className="edit-plan-content__plan">
          <PlanInput
            classNameList={['create-plan-content__plan--title']}
            editable={true}
            kind="title"
            placeholder="어떤 계획을 가지고 계신가요?"
            onChangeInput={handleChangeTitle}
            maxLength={20}
            textInput={planContent.title}
            nextTextAreaRef={nextTextAreaRef}
          />

          <PlanInput
            classNameList={['create-plan-content__plan--description']}
            editable={true}
            kind="content"
            placeholder="계획에 대해서 자세히 설명해주세요!"
            onChangeInput={handleChangeDescription}
            maxLength={250}
            textInput={planContent.description}
            nextTextAreaRef={nextTextAreaRef}
          />
        </div>

        <div className={classNames('edit-plan-content__tag')}>
          <InputTag onSubmit={handleAddTag} />
          <div className="edit-plan-content__tag--tags">
            {planContent.tags.map((tag, index) => (
              <Tag
                key={index}
                onClick={() => {
                  handleRemoveTag(tag);
                }}>
                {tag}
              </Tag>
            ))}
          </div>
          <AjajaButton
            ajajaCount={planData.ajajas}
            isFilled={planData.isPressAjaja}
            disabled
          />
        </div>
        <div className="edit-plan-content__switches">
          <div className={classNames('edit-plan-content__switches--public')}>
            <IconSwitchButton
              onIconName="PLAN_OPEN"
              offIconName="PLAN_CLOSE"
              isActive={planContent.isPublic}
              onClick={() => {
                handleChangeIsPublic(!planContent.isPublic);
              }}
            />
            <span className={classNames('font-size-xs')}>
              {planContent.isPublic ? '계획 공개' : '계획 비공개'}
            </span>
          </div>

          <div className={classNames('edit-plan-content__switches--can-ajaja')}>
            <IconSwitchButton
              onIconName="NOTIFICATION_ON"
              offIconName="NOTIFICATION_OFF"
              isActive={planContent.canAjaja}
              onClick={() => {
                handleChangeCanAjaja(!planContent.canAjaja);
              }}
            />
            <span className={classNames('font-size-xs')}>
              {planContent.canAjaja
                ? '매주 월요일 18:00시 마다 응원 메세지 알림 활성화'
                : '응원 메세지 알림 비활성화'}
            </span>
          </div>
        </div>
      </div>

      <div className="edit-plan-content__bottom">
        <Button
          color="white-100"
          background="primary"
          onClick={handleEditPlan}
          border={false}>
          수정완료
        </Button>
        <Link href={`/plans/${planId}`}>
          <Button color="primary" background="white-100" border>
            돌아가기
          </Button>
        </Link>
      </div>

      {isSelectIconModalOpen && (
        <Modal>
          <ModalSelectIcon
            setIconNumber={handleChangeIconNumber}
            closeModal={() => {
              setIsSelectIconModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
